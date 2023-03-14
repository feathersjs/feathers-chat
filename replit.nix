{ pkgs }: {
  deps = [
    pkgs.bashInteractive
    pkgs.nodejs-18_x
      pkgs.nodePackages.typescript-language-server
    pkgs.vim
    pkgs.bind.dnsutils
  ];
}