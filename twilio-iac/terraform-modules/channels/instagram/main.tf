terraform {
  required_providers {
    twilio = {
      source  = "twilio/twilio"
      version = "0.17.0"
    }
  }
}

locals {
  flow_definition = var.custom_flow_definition !=""? var.custom_flow_definition : templatefile(
    "${path.module}/../flow-templates/default/no-chatbot.tftpl",
    {
      master_workflow_sid = var.master_workflow_sid
      chat_task_channel_sid = var.chat_task_channel_sid
      channel_attributes = var.custom_channel_attributes != "" ? var.custom_channel_attributes : file("${path.module}/channel-attributes.tftpl")
      flow_description = "Instagram Messaging Flow"
    })
}

  resource "twilio_studio_flows_v2" "instagram_messaging_flow" {
    friendly_name = "Instagram Messaging Flow"
    status = "published"
    definition = local.flow_definition
  }

  resource "twilio_flex_flex_flows_v1" "instagram_flow" {
    channel_type  = "custom"
    chat_service_sid = var.flex_chat_service_sid
    friendly_name = "Flex Instagram Channel Flow"
    integration_type = "studio"
    contact_identity     = "instagram"
    integration_flow_sid = twilio_studio_flows_v2.instagram_messaging_flow.sid
    enabled = true
  }

  resource "aws_ssm_parameter" "instagram_flex_flow_sid_parameter" {
    name  = "${var.short_environment}_TWILIO_${var.short_helpline}_INSTAGRAM_FLEX_FLOW_SID"
    type  = "SecureString"
    value = twilio_flex_flex_flows_v1.instagram_flow.sid
    description = "Instagram Flex Flow SID"
  }
