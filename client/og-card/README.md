# Social preview card

`og.html` is the source for `client/public/og.png` (1200x630), the image link previews show for
peersend.app. It reuses the site's fonts and the room page's gradient. To regenerate after editing
(Chrome clips the bottom of a page whose height equals the window, hence the 700px window and the
centre-crop):

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu \
  --hide-scrollbars --force-device-scale-factor=2 --window-size=1200,700 --virtual-time-budget=8000 \
  --screenshot=og.png "file://$PWD/og.html"
sips --cropToHeightWidth 1260 2400 og.png && sips -z 630 1200 og.png && mv og.png ../public/og.png
```
