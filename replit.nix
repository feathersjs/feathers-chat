{ pkgs }: {
  deps = [
    pkgs.bashInteractive
    pkgs.nodejs-19_x
      pkgs.nodePackages.typescript-language-server
  ];
}