terraform {
  required_providers {
    twilio = {
      source  = "twilio/twilio"
      version = "0.17.0"
    }
  }

  backend "s3" {
    bucket         = "tl-terraform-state-production"
    key            = "twilio/hu/terraform.tfstate"
    dynamodb_table = "terraform-locks"
    region         = "us-east-1"
    encrypt        = true
    role_arn       = "arn:aws:iam::712893914485:role/tf-twilio-iac-production"
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
  helpline           = "Kék Vonal"
  short_helpline     = "HU"
  operating_info_key = "hu"
  environment        = "Production"
  short_environment  = "PROD"
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
  source                                = "../terraform-modules/taskRouter/default"
  custom_task_routing_filter_expression = "phone=='+3680984590' OR phone=='+3612344587' OR channelType=='web'"
  serverless_url                        = module.serverless.serverless_environment_production_url
  skip_timeout_expression               = "1==1"
  include_default_filter                = true
  helpline                              = "Kék Vonal"
}

module "studioFlow" {
  source                   = "../terraform-modules/studioFlow/default"
  master_workflow_sid      = module.taskRouter.master_workflow_sid
  chat_task_channel_sid    = module.taskRouter.chat_task_channel_sid
  default_task_channel_sid = module.taskRouter.default_task_channel_sid
  pre_survey_bot_sid       = twilio_autopilot_assistants_v1.chatbot_default.sid
  custom_flow_definition = templatefile(
    "./flow.tftpl",
    {
      master_workflow_sid      = module.taskRouter.master_workflow_sid
      chat_task_channel_sid    = module.taskRouter.chat_task_channel_sid
      default_task_channel_sid = module.taskRouter.default_task_channel_sid
      chatbot_default_sid      = twilio_autopilot_assistants_v1.chatbot_default.sid
      chatbot_ru_HU_sid        = twilio_autopilot_assistants_v1.chatbot_ru_HU.sid
      chatbot_ukr_HU_sid       = twilio_autopilot_assistants_v1.chatbot_ukr_HU.sid
  })
}

module "flex" {
  source                          = "../terraform-modules/flex/default"
  twilio_account_sid              = local.secrets.twilio_account_sid
  short_environment               = local.short_environment
  environment                     = local.environment
  messaging_flow_contact_identity = "+12014821989"
  flex_chat_service_sid           = module.services.flex_chat_service_sid
  messaging_studio_flow_sid       = module.studioFlow.messaging_studio_flow_sid
}

module "survey" {
  source                             = "../terraform-modules/survey/default"
  helpline                           = local.helpline
  flex_task_assignment_workspace_sid = module.taskRouter.flex_task_assignment_workspace_sid
}

module "aws" {
  source                             = "../terraform-modules/aws/default"
  twilio_account_sid                 = local.secrets.twilio_account_sid
  twilio_auth_token                  = local.secrets.twilio_auth_token
  serverless_url                     = module.serverless.serverless_environment_production_url
  helpline                           = local.helpline
  short_helpline                     = local.short_helpline
  short_environment                  = local.short_environment
  environment                        = local.environment
  operating_info_key                 = local.operating_info_key
  datadog_app_id                     = local.secrets.datadog_app_id
  datadog_access_token               = local.secrets.datadog_access_token
  flex_task_assignment_workspace_sid = module.taskRouter.flex_task_assignment_workspace_sid
  master_workflow_sid                = module.taskRouter.master_workflow_sid
  shared_state_sync_service_sid      = module.services.shared_state_sync_service_sid
  flex_chat_service_sid              = module.services.flex_chat_service_sid
  flex_proxy_service_sid             = module.services.flex_proxy_service_sid
  post_survey_bot_sid                = twilio_autopilot_assistants_v1.chatbot_postsurvey.sid
  survey_workflow_sid                = module.survey.survey_workflow_sid
  bucket_region                      = "us-east-1"
}

module "aws_monitoring" {
  source            = "../terraform-modules/aws-monitoring/default"
  helpline          = local.helpline
  short_helpline    = local.short_helpline
  environment       = local.environment
  cloudwatch_region = "us-east-1"
}

module "github" {
  source             = "../terraform-modules/github/default"
  twilio_account_sid = local.secrets.twilio_account_sid
  twilio_auth_token  = local.secrets.twilio_auth_token
  short_environment  = local.short_environment
  short_helpline     = local.short_helpline
  serverless_url     = module.serverless.serverless_environment_production_url
}
