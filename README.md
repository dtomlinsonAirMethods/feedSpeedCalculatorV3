# Okuma Genos Converter

A browser-based tool for converting Mastercam HAAS posts to Okuma OSP format — including G-code tool remapping, WCS offset incrementing, and setup sheet PDF conversion.

**Live tool:** [dtomlinsonairmethods.github.io/feedSpeedCalculatorV3/converter.html](https://dtomlinsonairmethods.github.io/feedSpeedCalculatorV3/converter.html)

---

## Programming Instructions

### 1 — Set Up Mastercam

- Make sure original HAAS program is in good standing and has HELICAL tooling
- Create a new machine group named **OKUMA CONVERTED**
- Select post: **OKUMA OSP 3X VMC MILL**
- Create stock
- Turn off **"Use tool's step, peck, and coolant"**

### 2 — Build Toolpath Groups

- Create toolpath groups for each operation
- Copy toolpaths from the HAAS machine group
- Paste into the corresponding Okuma toolpath group
- Replace the 3" shell mill with the 1.9392" Okuma face mill if needed
- Select all operations and enable:
  - **Coolant** — ON
  - **Misc. Values** — set to post values

### 3 — Setup Sheet & Post

- Create setup sheet, save as: `Part Number Rev- ECO - OKUMA`
- Post toolpaths, save in the Okuma folder as: `vPart-NumberOP#`
  - Example: `v901-2624OP1`

---

## Converting

There are two ways to convert — directly through the app, or automatically through Mastercam.

### G-Code

#### Option A — Mastercam Integration (recommended)
1. Post toolpaths from Mastercam as normal — a dialog will appear for each file asking to convert
2. Click **Yes** — the file is converted and CimcoEdit opens automatically with the result
3. The app opens showing the conversion log and side-by-side preview
4. Verify tools and WCS were changed correctly
   > **Note:** If a tool is missing from the library it will be flagged in the app — add it then re-post

#### Option B — Manual Upload via App
1. Open the **Converter** tab in the app
2. Upload all program files at once
3. Verify tools and WCS were changed correctly in the side-by-side preview
   > **Note:** If a tool is not in the library you will notice it here — add it to the converter tool library and to the Okuma tool library in Mastercam
4. Download and save over the original files posted from Mastercam

---

### Setup Sheet (PDF)

#### Option A — Right-Click (recommended)
1. Save the setup sheet PDF from Mastercam as normal
2. Right-click the PDF → **Show more options → Convert to Okuma Format**
3. Click **Yes** — Adobe opens automatically with the converted PDF
   > **Note:** If a tool is missing the app will open — add it then right-click and convert again

#### Option B — Manual Upload via App
1. Open the **PDF Setup Sheet** tab in the app
2. Upload the setup sheet PDF
3. Verify tool numbers, H and D values, and WO: were changed correctly in the conversion preview
4. Download the converted PDF

---

## Mastercam Integration Setup

To enable Option A for both G-code and PDF conversion, run the one-time setup:

1. Click the **⚙ MASTERCAM** button in the app
2. Download and double-click **Setup.bat** — installs everything automatically
3. In Mastercam: **File → Configuration → Start/Exit → Editor** — browse to `OkumaConverter.vbs`

---

## Considerations

| Issue                   | Action |
|---                      |---|

| 3" shell mill           | Must be changed to 1.9392" face mill in Mastercam — diameter difference affects cut |

| Missing tools           | Add to converter tool library **and** Okuma tool library in Mastercam |
   
| Tool number not
showing correctly on      | A tool description in Mastercam can cause the tool number to display incorrectly on the PDF — 
Operation List              right click **Edit Tool** in Mastercam, delete the description, and repost the setup sheet |
         

---

## Disclaimer

Built as a PWA — works offline after first load. No data leaves the browser.