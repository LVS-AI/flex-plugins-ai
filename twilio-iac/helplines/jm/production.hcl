locals {
  common_config_hcl = read_terragrunt_config("common.hcl")
  common_config     = local.common_config_hcl.locals.config
  config            = merge(local.common_config, local.local_config)

  local_config = {

    #Studio flow
    flow_vars = {
      service_sid                            = "xx"
      environment_sid                        = "xx"
      capture_channel_with_bot_function_sid  = "xx"
      capture_channel_with_bot_function_name = "channelCapture/captureChannelWithBot"
    }


    #Chatbots

    #Feature flags
    feature_flags = {
      "enable_fullstory_monitoring" : true,
      "enable_upload_documents" : true,
      "enable_post_survey" : true,
      "enable_contact_editing" : true,
      "enable_case_management" : true,
      "enable_offline_contact" : true,
      "enable_filter_cases" : true,
      "enable_sort_cases" : true,
      "enable_transfers" : true,
      "enable_manual_pulling" : false,
      "enable_csam_report" : false,
      "enable_canned_responses" : true,
      "enable_dual_write" : false,
      "enable_save_insights" : true,
      "enable_previous_contacts" : true,
      "enable_voice_recordings" : true,
      "enable_twilio_transcripts" : true,
      "enable_external_transcripts" : true,
      "post_survey_serverless_handled" : true,
      "enable_csam_clc_report" : false,
      "enable_counselor_toolkits" : false,
      "enable_resources" : false,
      "enable_emoji_picker" : true,
      "enable_aselo_messaging_ui" : true
    }
  }
}