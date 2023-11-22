terraform {
  required_providers {
    twilio = {
      source  = "twilio/twilio"
      version = "0.17.0"
    }
  }

  backend "s3" {
    bucket         = "tl-terraform-state-staging"
    key            = "twilio/uk/terraform.tfstate"
    dynamodb_table = "terraform-locks"
    encrypt        = true
    role_arn       = "arn:aws:iam::712893914485:role/tf-twilio-iac-staging"
  }
}

provider "aws" {
  assume_role {
    role_arn     = "arn:aws:iam::712893914485:role/tf-twilio-iac-${lower(local.environment)}"
    session_name = "tf-${basename(abspath(path.module))}"
  }
}

data "aws_ssm_parameter" "secrets" {
  name = "/terraform/twilio-iac/${basename(abspath(path.module))}/secrets.json"
}

locals {
  secrets            = jsondecode(data.aws_ssm_parameter.secrets.value)
  helpline           = "RevengePorn"
  short_helpline     = "UK"
  operating_info_key = "uk"
  environment        = "Staging"
  short_environment  = "STG"

  task_language      = "en-US"
  enable_post_survey = false
  events_filter = [
    "task.created",
    "task.canceled",
    "task.completed",
    "task.deleted",
    "task.wrapup",
    "task-queue.entered",
    "task.system-deleted",
    "reservation.accepted",
    "reservation.rejected",
    "reservation.timeout",
    "reservation.wrapup",
  ]

  custom_task_routing_filter_expression = ""

  workflows = {
    master : {
      friendly_name : "Master Workflow"
      templatefile : "/app/twilio-iac/helplines/uk/templates/workflows/master.tftpl"
    },
    survey : {
      friendly_name : "Survey Workflow"
      templatefile : "/app/twilio-iac/helplines/templates/workflows/lex.tftpl"
    }
  }

  task_queues = {
    master : {
      "target_workers" = "routing.skills HAS 'RP'",
      "friendly_name"  = "Revenge Porn"
    },
    rhc : {
      "target_workers" = "routing.skills HAS 'RHC'",
      "friendly_name"  = "RHC"
    },
    posh : {
      "target_workers" = "routing.skills HAS 'POSH'",
      "friendly_name"  = "POSH"
    },
    survey : {
      "target_workers" = "1==0",
      "friendly_name"  = "Survey"
    },
    e2e_test : {
      "target_workers" = "email=='aselo-alerts+production@techmatters.org'",
      "friendly_name"  = "E2E Test Queue"
    }
  }
  task_channels = {
    default : "Default"
    chat : "Programmable Chat"
    voice : "Voice"
    sms : "SMS"
    video : "Video"
    email : "Email"
    survey : "Survey"
  }


  //common across all helplines
  channel_attributes = {
    webchat : "/app/twilio-iac/helplines/templates/channel-attributes/webchat.tftpl"
    voice : "/app/twilio-iac/helplines/templates/channel-attributes/voice.tftpl"
    twitter : "/app/twilio-iac/helplines/templates/channel-attributes/twitter.tftpl"
    default : "/app/twilio-iac/helplines/templates/channel-attributes/default.tftpl"
  }

  flow_vars = {
  }

  channels = {
    webchat : {
      channel_type         = "web"
      contact_identity     = ""
      templatefile         = "/app/twilio-iac/helplines/templates/studio-flows/messaging.tftpl"
      channel_flow_vars    = {}
      chatbot_unique_names = []
    },
    whatsapp : {
      channel_type         = "whatsapp"
      contact_identity     = "whatsapp:+447897033993"
      templatefile         = "/app/twilio-iac/helplines/templates/studio-flows/messaging.tftpl"
      channel_flow_vars    = {}
      chatbot_unique_names = []
    }
  }



}

provider "twilio" {
  username = local.secrets.twilio_account_sid
  password = local.secrets.twilio_auth_token
}

module "hrmServiceIntegration" {
  source            = "../terraform-modules/hrmServiceIntegration/default"
  local_os          = var.local_os
  helpline          = local.helpline
  short_helpline    = local.short_helpline
  environment       = local.environment
  short_environment = local.short_environment
}

module "serverless" {
  source             = "../terraform-modules/serverless/default"
  twilio_account_sid = local.secrets.twilio_account_sid
  twilio_auth_token  = local.secrets.twilio_auth_token
}

module "services" {
  source            = "../terraform-modules/services/default"
  local_os          = var.local_os
  helpline          = local.helpline
  short_helpline    = local.short_helpline
  environment       = local.environment
  short_environment = local.short_environment
}
module "taskRouter" {
  source                                = "../terraform-modules/taskRouter/v1"
  serverless_url                        = module.serverless.serverless_environment_production_url
  events_filter                         = local.events_filter
  task_queues                           = local.task_queues
  workflows                             = local.workflows
  task_channels                         = local.task_channels
  custom_task_routing_filter_expression = local.custom_task_routing_filter_expression
  helpline                              = local.helpline

}



module "channel" {

  source                = "../terraform-modules/channels/v1"
  workflow_sids         = module.taskRouter.workflow_sids
  task_channel_sids     = module.taskRouter.task_channel_sids
  channel_attributes    = local.channel_attributes
  channels              = local.channels
  enable_post_survey    = local.enable_post_survey
  flex_chat_service_sid = module.services.flex_chat_service_sid
  task_language         = local.task_language
  flow_vars             = local.flow_vars
  short_environment     = local.short_environment
  short_helpline        = local.short_helpline
  environment           = local.environment
  serverless_url        = module.serverless.serverless_environment_production_url

}
module "aws" {
  source                             = "../terraform-modules/aws/default"
  twilio_account_sid                 = local.secrets.twilio_account_sid
  twilio_auth_token                  = local.secrets.twilio_auth_token
  serverless_url                     = module.serverless.serverless_environment_production_url
  helpline                           = local.helpline
  short_helpline                     = local.short_helpline
  environment                        = local.environment
  short_environment                  = local.short_environment
  operating_info_key                 = local.operating_info_key
  datadog_app_id                     = local.secrets.datadog_app_id
  datadog_access_token               = local.secrets.datadog_access_token
  flex_task_assignment_workspace_sid = module.taskRouter.flex_task_assignment_workspace_sid
  master_workflow_sid                = module.taskRouter.workflow_sids["master"]
  shared_state_sync_service_sid      = module.services.shared_state_sync_service_sid
  flex_chat_service_sid              = module.services.flex_chat_service_sid
  flex_proxy_service_sid             = module.services.flex_proxy_service_sid
  post_survey_bot_sid                = "deleted"
  survey_workflow_sid                = module.taskRouter.workflow_sids["survey"]
}
