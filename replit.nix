{ pkgs }: {
  deps = [
    pkgs.nodejs-19_x
      pkgs.nodePackages.typescript-language-server
  ];
}
