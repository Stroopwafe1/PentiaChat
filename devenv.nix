{ pkgs, lib, config, inputs, ... }:

let
  unstable = import inputs.unstable { system = pkgs.stdenv.system; config.allowUnfree = true; };
in
{
  env.EDGE_PATH = "${pkgs.ungoogled-chromium}";

  # https://devenv.sh/packages/
  packages = [
    pkgs.git
    pkgs.ungoogled-chromium
    pkgs.jdk17
    pkgs.firebase-tools
    pkgs.android-tools
    pkgs.nodejs_22
    unstable.android-studio
    pkgs.vscodium-fhs
  ];

  languages.javascript = {
    enable = true;
    package = pkgs.nodejs_22;
    npm.enable = true;
    npm.install.enable = true;
    directory = "./PentiaChat";
  };

  languages.typescript.enable = true;

  languages.java = {
    enable = true;
    gradle.enable = true;
    jdk.package = pkgs.jdk17;
  };

#   android = {
#     enable = true;
#     platforms.version = [ "34" "35" ];
#     platformTools.version = "34.0.5";
#     buildTools.version = [ "34.0.0" ];
#   };

  enterShell = ''
    codium PentiaChat
  '';
}
