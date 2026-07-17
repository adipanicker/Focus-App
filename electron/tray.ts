import { Tray, Menu, app, nativeImage } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getMainWindow } from "./windows/mainWindow";
import { getPipWindow } from "./windows/pipWindow";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let tray: Tray | null = null;

export function createTray() {
  const iconPath = path.join(__dirname, "../assets/tray-icon.png");
  const icon = nativeImage.createFromPath(iconPath);
  tray = new Tray(icon.isEmpty() ? nativeImage.createEmpty() : icon);

  const menu = Menu.buildFromTemplate([
    {
      label: "Open Focus",
      click: () => {
        getMainWindow()?.show();
      },
    },
    { type: "separator" },
    {
      label: "Quit",
      click: () => {
        (app as any).isQuitting = true;
        getPipWindow()?.destroy();
        app.quit();
      },
    },
  ]);

  tray.setToolTip("Focus");
  tray.setContextMenu(menu);

  tray.on("double-click", () => {
    getMainWindow()?.show();
  });
}
