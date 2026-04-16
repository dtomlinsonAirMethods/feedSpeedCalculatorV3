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
  - **Force Tool Change** — ON
  - **Misc. Values** — set to post values

### 3 — Setup Sheet & Post

- Create setup sheet, save as: `Part Number Rev- ECO - OKUMA`
- Post toolpaths, save in the Okuma folder as: `vPart-NumberOP#`
  - Example: `v901-2624OP1`

---

## Converting

### G-Code

1. Upload all program files at once in the **G-Code Converter** tab
2. Verify tools and WCS were changed correctly in the side-by-side preview
   > **Note:** If a tool is not in the library you will notice it here — add it to the converter tool library and to the Okuma tool library in Mastercam
3. Save over the original files that were posted from Mastercam

### Setup Sheet (PDF)

1. Upload the setup sheet in the **PDF Setup Sheet** tab
2. Verify tool numbers, H and D values, and WO: were changed correctly in the conversion preview

---

## Considerations

| Issue |                               |Action |
|---|---|
| 3" shell mill                         | Must be changed to 1.9392" face mill in Mastercam — diameter difference affects cut |
| Missing tools                         | Add to converter tool library **and** Okuma tool library in Mastercam |
| Coolant ignored after post switch     | Select all ops → Edit Common Parameters → Coolant ON, Force Tool Change ON, Misc. Values to post values |

---

## Disclaimer

Built as a PWA — works offline after first load. No data leaves the browser.
