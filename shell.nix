{ pkgs ? (import <nixpkgs> {
  config.allowUnfree = true;
  config.android_sdk.accept_license = true;
}) }:

pkgs.mkShell rec {
  buildInputs = with pkgs; [
      nodejs_22
      jdk17
      firebase-tools
      android-tools
	  ungoogled-chromium
  ];

  ANDROID_HOME = "/home/lilith/Android/Sdk";
  ANDROID_NDK_ROOT = "${ANDROID_HOME}/ndk";
  GRADLE_OPTS = "-Dorg.gradle.project.android.aapt2FromMavenOverride=${ANDROID_HOME}/build-tools/35.0.1/aapt2";
  EDGE_PATH = "${pkgs.ungoogled-chromium}";

  shellHook = ''
   export PATH="$PATH:${ANDROID_HOME}/emulator:${ANDROID_HOME}/tools:${ANDROID_HOME}/tools/bin:${ANDROID_HOME}/platform-tools";
   android-studio &>/dev/null &
  '';
}
