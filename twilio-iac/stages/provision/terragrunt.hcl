/**
  * We import the terragrunt root config that handles most of the shared setup and
  * configuration for all of our stages
  */
include "root" {
  path = find_in_parent_folders("terragrunt.root.hcl")

  expose = true
}

/**
  * We can override the root config with local configuration options if we need to.
  */
locals {
  local_config = {}

  config = merge(include.root.locals.config, local.local_config)
}

/**
  * This sets the variables that are fed into the stage module to be the combined config at local.config
  */
inputs = local.config

/**
  * This is the main terragrunt block that defines the stage module and the hooks that run before it.
  */
terraform {


  source = "../../terraform-modules//stages/${include.root.locals.stage}"
}