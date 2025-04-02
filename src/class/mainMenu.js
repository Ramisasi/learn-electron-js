import { Menu, shell, dialog } from "electron";

class mainMenu {
  constructor() {
    let template = [
      {
        label: "File",
        submenu: [
          {
            label: "Exit",
            role: "quit",
          },
        ],
      },
      {
        label: "help",
        click: () => {
          shell.openExternal("https://www.electronjs.org/docs/api/menu");
        },
      },
      {
        label: "Exit",
        click: () => {
          dialog.showMessageBox({
            type: "info",
            title: "Exit",
            message: "Are you sure you want to exit?",
            buttons: ["Yes", "No"],
          });
        },
      },
    ];
    let menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }
}
export default mainMenu;
