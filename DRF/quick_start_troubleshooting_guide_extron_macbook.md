**Quick‑Start Troubleshooting Guide – MacBook + Extron Video Setup**  
*(For end‑user who can only change cables, adapters, and macOS settings – no access to Extron configuration tools)*  

***

### 1️⃣ Verify the Physical Layer  

| Step | What to Do | Why it Helps | Source |
|------|------------|--------------|--------|
| **Check the cable** | Use a known‑good HDMI (or USB‑C‑to‑HDMI) cable. Try a different cable or a shorter run. | Bad or long cables can drop the HDMI signal, especially with MacBooks that are sensitive to signal integrity. |  [kb.uccs](https://kb.uccs.edu/display/ASK/Fixing+Video+Issues:+Standard+Extron+Room) – “Fixing Video Issues: Standard Extron Room” |
| **Test the adapter** | If you use a USB‑C/Thunderbolt‑to‑HDMI dongle, swap it for another (preferably an Apple‑branded or Moshi 4K adapter). | Many MacBook‑Retina models need a specific active adapter; cheap converters often fail EDID/HDCP handshake. |  [visibleprocrastinations.wordpress](https://visibleprocrastinations.wordpress.com/2016/12/15/macbook-pro-with-retina-display-not-working-via-hdmi-extron-wall-plate/) – Moshi adapter fixed Retina MacBook HDMI via Extron wall plate |
| **Secure connections** | Unplug and reseat both ends of the cable/adapter. Look for bent pins or debris. | Loose contacts cause intermittent “no signal” or green‑screen symptoms. |  [reddit](https://www.reddit.com/r/CommercialAV/comments/164gyyr/extron_pro_725t_does_not_recognize_macbook_is/) – Reddit on Pro 725t not recognizing MacBook |
| **Power cycle the Extron gear** | Turn the Extron switcher/matrix/NAV endpoint off, wait ~10 s, then power it back on. | Forces the device to renegotiate EDID/HDCP when the MacBook is reconnected. |  [classrooms.utk](https://classrooms.utk.edu/troubleshooting-guide/troubleshooting-macs/) – Troubleshooting Macs (audio/video) |
| **Try a different input** | If the Extron device has multiple HDMI inputs, move the MacBook to another port. | Isolates whether a specific input port is faulty or stuck on a bad EDID. |  [kb.uccs](https://kb.uccs.edu/display/ASK/Fixing+Video+Issues:+Standard+Extron+Room) – Same as above |

***

### 2️⃣ macOS Display Settings  

| Action | How to Do It | What it Fixes | Source |
|--------|--------------|---------------|--------|
| **Detect Displays** | Open **System Settings → Displays**, hold the **Option** key, click **Detect Displays**. | Forces macOS to rediscover the EDID of the Extron endpoint, clearing stale EDID caches. |  [youtube](https://www.youtube.com/watch?v=8YwJ7xdSUAc) – YouTube “Macbook Pro HDMI port not working?” |
| **Try a Scaled resolution** | In Displays, select **Scaled** and pick a lower resolution (e.g., 1080p) then apply. Switch back to native if needed. | Some MacBooks (especially M1/M2) get stuck on high‑res EDID; dropping to a safer mode often restores video. |  [it.umn](https://it.umn.edu/services-technologies/how-tos/classroom-troubleshoot-projection-issue) – UMN guide for M1‑related projection issues |
| **Disable mirroring (if using extended desktop)** | Ensure **Mirror Displays** is off if you want extended desktop; test both modes. | Mirroring can sometimes trigger HDCP handshake failures; extended mode may work. |  [youtube](https://www.youtube.com/watch?v=ftM6NYk5NRM) – Full guide to external monitor not working on Mac |
| **Check color profile** | In Displays → Color, try switching to **sRGB IEC61966‑2.1** or the default profile. | Rare color‑profile mismatches can cause a black or green screen. | General macOS troubleshooting (implied by multiple sources) |

***

### 3️⃣ Audio (if you also need sound over HDMI)  

1. **Open System Settings → Sound → Output**.  
2. Select the **Extron HDMI** (or similar) device instead of “MacBook Speakers”.  
3. If the Extron option doesn’t appear, unplug/replug the HDMI cable while the Sound pane is open – macOS often only shows the HDMI output after a hot‑plug event.  

*Why*: MacBooks don’t always automatically switch audio to HDMI when routed through Extron HDBaseT or matrix equipment; you must manually pick the HDMI output.  

-  – Cal Poly KB on selecting Extron HDMI for audio [calpoly.atlassian](https://calpoly.atlassian.net/wiki/spaces/CPKB/pages/2733342737/Apple+MacBook+Audio+over+HDMI+-+Select+Extron+HDMI)
-  – Troubleshooting Macs (audio section) [classrooms.utk](https://classrooms.utk.edu/troubleshooting-guide/troubleshooting-macs/)

***

### 4️⃣ HDCP / EDID Quick Checks (User‑Level)  

| Check | What to Look For | User‑Level Action |
|-------|------------------|-------------------|
| **HDCP notice** | Some Extron devices show an HDCP LED or on‑screen warning when HDCP is active. | If you see HDCP active and you’re playing non‑protected content (e.g., PowerPoint, desktop), try disabling HDCP in the source (not possible on Mac) or use a different input that the Extron device has set to **HDCP Off** (if you can access the front panel). Many users report that turning HDCP **off** on the Extron input resolves MacBook picture loss. |  [reddit](https://www.reddit.com/r/CommercialAV/comments/164gyyr/extron_pro_725t_does_not_recognize_macbook_is/) – Reddit: “What ever device is transmitting the HDMI signal needs to get the HDCP turned off.” |
| **EDID mismatch** | If the Mac shows a low‑resolution mode or no picture while a PC works, the EDID may be advertising a resolution the Mac can’t handle. | Power‑cycle the Extron device *after* connecting the MacBook, or connect a different source (like a DVD player) first to “prime” the EDID, then switch to the MacBook. |  [reddit](https://www.reddit.com/r/VIDEOENGINEERING/comments/194ndr0/mac_os_and_edidhdcp_is_ruining_my_life/) – VIDEOENGINEERING Reddit on EDID/HDCP ruining life |
| **Hot‑Plug detection** | Some Extron matrices have a “Hot Plug” setting that determines whether they renegotiate EDID when the display changes. | If you can access the front panel, toggle Hot Plug **ON** so the matrix renegotiates EDID each time you switch inputs. |  [reddit](https://www.reddit.com/r/VIDEOENGINEERING/comments/194ndr0/mac_os_and_edidhdcp_is_ruining_my_life/) – Same Reddit thread mentions hot‑plug setting |

*(Note: These steps only require observing LEDs or using the front‑panel buttons; they do not need Extron Configuration Software.)*  

***

### 5️⃣ Software / System Refresh  

| Action | How | Effect |
|--------|-----|--------|
| **Restart the MacBook** | Apple menu → Restart. | Clears any stuck graphics drivers or HDMI state machines. |  [youtube](https://www.youtube.com/watch?v=ucHgli0aUvw) – YouTube video on fixing “No Signal” on Smart TV (includes Mac reboot) |
| **Reset NVRAM/PRAM** (Intel Macs) | Shut down, then power on holding **Option‑Command‑P‑R** for ~20 s. | Forces macOS to forget stored display‑port settings that might be corrupt. | General Mac troubleshooting (implied by many sources) |
| **Boot in Safe Mode** (if problem persists) | Hold **Shift** at startup. | Loads only essential kernel extensions; if video works in Safe Mode, a third‑party driver or login item is interfering. | General Mac troubleshooting |

***

### 6️⃣ When All Else Fails – Work‑Arounds  

- **Use a different source** (e.g., a USB‑C hub with HDMI) to confirm the MacBook’s video output works elsewhere.  
- **Try a different display** (plug the MacBook directly into a TV or monitor) to rule out the MacBook itself.  
- **Bypass the Extron matrix** temporarily: connect the MacBook straight to the projector or monitor via a short HDMI cable. If that works, the issue is definitely in the Extron chain.  

***

## TL;DR Checklist (Copy‑Paste for Your Notes)

```
[ ] Cable/adapter – try known‑good, shorter, Apple/Moshi if using USB‑C
[ ] Reseat both ends; look for damage
[ ] Power‑cycle Extron device (off → wait 10 s → on) ***Probably not possible to do***
[ ] Move MacBook to another HDMI input on Extron gear
[ ] System Settings → Displays → Option‑click Detect Displays
[ ] Try a Scaled (lower) resolution, then apply
[ ] Sound → Output → select Extron HDMI
[ ] Restart MacBook
[ ] (Intel Mac) Reset NVRAM: Opt‑Cmd‑P‑R at boot
[ ] Observe Extron HDCP LED – if on and you’re not playing protected content, try to set HDCP off via front panel if possible
[ ] If still no picture, test MacBook directly to a monitor/TV
```

***