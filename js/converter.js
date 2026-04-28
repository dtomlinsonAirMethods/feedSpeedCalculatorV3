// ============================================================
//  converter.js — Okuma Genos Converter Logic
//  v2 — Full tool library, exact keyword matching, edit/sort
// ============================================================

// ── Default tool library — loaded from OKUMA ALUMINUM.TOOLDB ──
// localStorage overrides this on load if user has saved changes
const DEFAULT_LIBRARY = [
  { matchType: 'serial',  matchVal: '82045',  okuma: 1, desc: 'HELICAL - 82045 - ROUGHER - 3/4 DIA X 2.25 LOC X .03 RAD' },
  { matchType: 'serial',  matchVal: '48655',  okuma: 2, desc: 'HELICAL - 48655 - 3/4 DIA X 2.25 LOC' },
  { matchType: 'serial',  matchVal: '48665',  okuma: 3, desc: 'HELICAL - 48665 - 3/4 DIA X 2.25 LOC X .06 RAD' },
  { matchType: 'serial',  matchVal: '82033',  okuma: 4, desc: 'HELICAL - 82033 - ROUGHER -1/2 DIA X 2.0 LOC X .06 RADIUS' },
  { matchType: 'serial',  matchVal: '48455',  okuma: 5, desc: 'HELICAL - 48455 - 1/2 DIA X 2.00 LOC' },
  { matchType: 'serial',  matchVal: '48325',  okuma: 6, desc: 'HELICAL - 48325 - 3/8 DIA X 1.5 LOC X .06 RAD' },
  { matchType: 'serial',  matchVal: '48310',  okuma: 7, desc: 'HELICAL - 48310 - 3/8 DIA X 1.5 LOC' },
  { matchType: 'serial',  matchVal: '48130',  okuma: 8, desc: 'HELICAL - 48130 - 1/4 DIA X .75 LOC X .06 RAD' },
  { matchType: 'serial',  matchVal: '48135',  okuma: 9, desc: 'HELICAL - 48135 - 1/4 DIA X 1.0 LOC' },
  { matchType: 'serial',  matchVal: '48395',  okuma: 10, desc: 'HELICAL - 48395 - 1/2 DIA X 1.25 LOC' },
  { matchType: 'keyword', matchVal: '1/4 90 DEGREE CHAMFER MILL', altVals: ['1/4 -90 DEG CHAMFER MILL', '1/4 90 DEG CHAMFER MILL'], okuma: 11, desc: '1/4 90 DEGREE CHAMFER MILL' },
  { matchType: 'keyword', matchVal: '1/4 SPOTDRILL', altVals: ['1/4 90 DEGREE SPOTDRILL', '1/4 SPOTDRILL'], okuma: 12, desc: '1/4 SPOTDRILL' },
  { matchType: 'keyword', matchVal: 'NO. 40 STUB DRILL', okuma: 13, desc: 'NO. 40 STUB DRILL' },
  { matchType: 'keyword', matchVal: 'NO. 7 STUB DRILL', okuma: 14, desc: 'NO. 7 STUB DRILL' },
  { matchType: 'keyword', matchVal: 'LTR. F STUB DRILL', okuma: 15, desc: 'LTR. F STUB DRILL' },
  { matchType: 'keyword', matchVal: '1/2 100 DEGREE COUNTERSINK', okuma: 16, desc: '1/2 100 DEGREE COUNTERSINK' },
  { matchType: 'keyword', matchVal: 'NO. 16 STUB DRILL', altVals: ['#16 DRILL', 'NO. 16 DRILL', 'NO. 16 STUB DRILL'], okuma: 17, desc: 'NO. 16 STUB DRILL' },
  { matchType: 'keyword', matchVal: '10-32 FORM TAP RH', okuma: 18, desc: '10-32 FORM TAP RH' },
  { matchType: 'keyword', matchVal: 'LTR. A STUB DRILL', okuma: 19, desc: 'LTR. A STUB DRILL' },
  { matchType: 'keyword', matchVal: 'RA390-051R19-11M', okuma: 20, desc: 'RA390-051R19-11M' },
  { matchType: 'keyword', matchVal: '1/4-28 FORM TAP RH', okuma: 21, desc: '1/4-28 FORM TAP RH' },
  { matchType: 'serial',  matchVal: '48120',  okuma: 22, desc: 'HELICAL - 48120 - 1/4 DIA X .750 LOC X.015 RAD' },
  { matchType: 'serial',  matchVal: '49105',  okuma: 23, desc: 'HELICAL - 49105 - 1/4 DIA X .750 LOC - BALL EM' },
  { matchType: 'serial',  matchVal: '48020',  okuma: 24, desc: 'HELICAL - 48020 - 1/8 DIA X .500 LOC' },
  { matchType: 'serial',  matchVal: '48125',  okuma: 25, desc: 'HELICAL - 48125 - 1/4 DIA X .750 LOC X .030 RAD' },
  { matchType: 'serial',  matchVal: '48275',  okuma: 26, desc: 'HELICAL - 48275 - 3/8 DIA X 1.0 LOC X .06 RAD' },
  { matchType: 'serial',  matchVal: '987136', okuma: 27, desc: '#12 TM HARVEY - 987136-C3 - 10-32 Thread Mill' },
  { matchType: 'keyword', matchVal: 'NO. 21 STUB DRILL', altVals: ['#21 STUB DRILL', 'NO. 21 STUB DRILL'], okuma: 28, desc: 'NO. 21 STUB DRILL' },
  { matchType: 'serial',  matchVal: '83681',  okuma: 29, desc: 'HELICAL - 83681 - 1/2 DIA X 1.6250 LOC X .125 RAD' },
  { matchType: 'keyword', matchVal: 'NO. 3 STUB DRILL', okuma: 30, desc: 'NO. 3 STUB DRILL' },
  { matchType: 'keyword', matchVal: 'LTR. G STUB DRILL', okuma: 31, desc: 'LTR. G STUB DRILL' },
  { matchType: 'keyword', matchVal: '7/32 STUB DRILL', okuma: 32, desc: '7/32 STUB DRILL' },
  { matchType: 'keyword', matchVal: '3/8 90 DEGREE CHAMFER MILL', okuma: 33, desc: '3/8 90 DEGREE CHAMFER MILL' },
  { matchType: 'keyword', matchVal: '1/8 90 DEGREE CHAMFER MILL', okuma: 34, desc: '1/8 90 DEGREE CHAMFER MILL' },
  { matchType: 'keyword', matchVal: '3/8 -SPOTDRILL', altVals: ['3/8 90 DEGREE SPOTDRILL', '3/8 -SPOTDRILL'], okuma: 35, desc: '3/8 -SPOTDRILL' },
  { matchType: 'keyword', matchVal: 'LTR. O STUB DRILL', okuma: 36, desc: 'LTR. O STUB DRILL' },
  { matchType: 'serial',  matchVal: '82021',  okuma: 37,  desc: 'HELICAL - 82021 - ROUGHER -1/2 DIA X 1.625 LOC X .03 RAD' },
  { matchType: 'serial',  matchVal: '48425',  okuma: 38,  desc: 'HELICAL - 48425 - 1/2 DIA X 1.625 LOC' },
  { matchType: 'serial',  matchVal: '48410',  okuma: 39,  desc: 'HELICAL - 48410 - 1/2 DIA X 1.25 LOC X 0.06 RAD' },
  { matchType: 'keyword', matchVal: '5/16 STUB DRILL', okuma: 40, desc: '5/16 STUB DRILL' },
  { matchType: 'serial',  matchVal: '82043',  okuma: 41, desc: 'HELICAL - 82043 - ROUGHER - 3/4 DIA X 1.625 LOC X .03 RAD' },
  { matchType: 'serial',  matchVal: '81417',  okuma: 42, desc: 'HELICAL - 81417 - 3/4 DIA X 2.75 LOC' },
  { matchType: 'serial',  matchVal: '48440',  okuma: 43, desc: 'HELICAL - 48440 - 1/2 DIA X 1.625 LOC X .06 RAD' },
  { matchType: 'serial',  matchVal: '49210',  okuma: 44, desc: 'HELICAL - 49210 - 3/8 DIA X 1.0 LOC - BALL EM' },
  { matchType: 'keyword', matchVal: '5/8 DEMMING DRILL', okuma: 45, desc: '5/8 DEMMING DRILL' },
  { matchType: 'keyword', matchVal: '7/32 JOBBER DRILL', okuma: 46, desc: '7/32 JOBBER DRILL' },
  { matchType: 'serial',  matchVal: '48260',  okuma: 47, desc: 'HELICAL - 48260 - 3/8 DIA X 1.0 LOC' },
  { matchType: 'serial',  matchVal: '81409',  okuma: 48, desc: 'HELICAL - 81409 - 5/16 DIA X 1.00 LOC' },
  { matchType: 'serial',  matchVal: '48675',  okuma: 49, desc: 'HELICAL - 48675 - 3/4 DIA X 2.25 LOC X .125 RAD' },
  { matchType: 'keyword', matchVal: '1/2 SPOTDRILL', altVals: ['1/2 90 DEGREE SPOTDRILL', '1/2 SPOTDRILL'], okuma: 50, desc: '1/2 SPOTDRILL' },
  { matchType: 'keyword', matchVal: 'LTR. J JOBBER DRILL', okuma: 51, desc: 'LTR. J JOBBER DRILL' },
  { matchType: 'serial',  matchVal: '48115',  okuma: 52, desc: 'HELICAL - 48115 - 1/4 DIA X 3/4 LOC' },
  { matchType: 'keyword', matchVal: 'NO. 22 STUB DRILL', okuma: 53, desc: 'NO. 22 STUB DRILL' },
  { matchType: 'serial',  matchVal: '81397',  okuma: 54, desc: 'HELICAL - 81397 - 1/8 DIA X .750 LOC' },
  { matchType: 'keyword', matchVal: '8-32 FORM TAP RH', altVals: ['0.1640 X 32.00 Right-hand tap - 8-32 FORM TAP RH', '0.1640 X 32.00 Right-hand tap - NO. 8-32 FORM TAP RH', 'NO. 8-32 FORM TAP RH'], okuma: 55, desc: '8-32 FORM TAP RH' },
  { matchType: 'keyword', matchVal: '3/8 100 DEGREE COUNTERSINK', okuma: 56, desc: '3/8 100 DEGREE COUNTERSINK' },
  { matchType: 'serial',  matchVal: '49240',  okuma: 57, desc: 'HELICAL - 49240 - 3/8 DIA X 1.5 LOC- BALL ENDMILL' },
  { matchType: 'keyword', matchVal: 'REDLINE - RET1233 - 3/32 DIA X .500 LOC', okuma: 58, desc: 'REDLINE - RET1233 - 3/32 DIA X .500 LOC' },
  { matchType: 'serial',  matchVal: '48655',  okuma: 59, desc: 'HELICAL - 48655 - 3/4 DIA X 2.25 LOC FINISHER' },
  { matchType: 'serial',  matchVal: '48470',  okuma: 60, desc: 'HELICAL - 48470 - 1/2 DIA X 2.0 LOC X .06 RAD' },
  { matchType: 'serial',  matchVal: '48480',  okuma: 61, desc: 'HELICAL - 48480 - 1/2 DIA X 2.0 LOC X .125 RAD' },
  { matchType: 'serial',  matchVal: '48685',  okuma: 62, desc: 'HELICAL - 48685 - 3/4 DIA X 2.25 LOC X .25 RAD' },
  { matchType: 'keyword', matchVal: 'NO. 7 JOBBER DRILL', okuma: 63, desc: 'NO. 7 JOBBER DRILL' },
  { matchType: 'keyword', matchVal: 'LTR. H JOBBER DRILL', okuma: 64, desc: 'LTR. H JOBBER DRILL' },
  { matchType: 'keyword', matchVal: '1/8 STUB DRILL', okuma: 65, desc: '1/8 STUB DRILL' },
  { matchType: 'keyword', matchVal: '#10 TM SCC2 TMLR139-32ELA 10-32 THREADMILL', okuma: 66, desc: '#10 TM SCC2 TMLR139-32ELA 10-32 THREADMILL' },
  { matchType: 'serial',  matchVal: '48420',  okuma: 67,  desc: 'HELICAL - 48420 - 1/2 DIA X 1.25 LOC X .125 RAD' },
  { matchType: 'keyword', matchVal: '1-20 Thread Mill - 0.125', okuma: 68, desc: '1-20 Thread Mill - 0.125' },
  { matchType: 'keyword', matchVal: '.257 -REAMER', okuma: 69, desc: '.257 -REAMER' },
  { matchType: 'keyword', matchVal: '5/8 - 100 DEGREE COUNTERSINK', okuma: 70, desc: '5/8 - 100 DEGREE COUNTERSINK' },
  { matchType: 'serial',  matchVal: '48060',  okuma: 71,  desc: 'HELICAL - 48060 - 3/16 DIA X 1.0 LOC' },
  { matchType: 'serial',  matchVal: '49285',  okuma: 72,  desc: 'HELICAL - 49285 - 1/2 DIA X 1.25 LOC BALL ENDMILL' },
  { matchType: 'keyword', matchVal: '1/8 - CORNER ROUND W/ .25 PILOT', okuma: 73, desc: '1/8 - CORNER ROUND W/ .25 PILOT' },
  { matchType: 'keyword', matchVal: '1/4-28 CUT TAP RH', okuma: 74, desc: '1/4-28 CUT TAP RH' },
  { matchType: 'serial',  matchVal: '81401',  okuma: 75, desc: 'HELICAL - 81401 - 1/4 DIA X 1.25 LOC' },
  { matchType: 'serial',  matchVal: '82393',  okuma: 76, desc: 'HELICAL - 82393 - 5/16 DIA X 1.25 LOC' },
  { matchType: 'keyword', matchVal: 'NO. 21 STUB DRILL', okuma: 77, desc: 'NO. 21 STUB DRILL' },
  { matchType: 'keyword', matchVal: '10-32 CUT TAP RH', okuma: 78, desc: '10-32 CUT TAP RH' },
  { matchType: 'keyword', matchVal: 'NO. 11 STUB DRILL', okuma: 79, desc: 'NO. 11 STUB DRILL' },
  { matchType: 'keyword', matchVal: 'NO. 6 STUB DRILL', altVals: ['#6 DRILL', 'NO. 6 STUB DRILL'], okuma: 80, desc: 'NO. 6 STUB DRILL' },
  { matchType: 'serial',  matchVal: '48640',  okuma: 81, desc: 'HELICAL - 48640 - 3/4 DIA X 1.625 LOC X .125 RAD' },
  { matchType: 'keyword', matchVal: 'NO. 4 STUB DRILL', okuma: 82, desc: 'NO. 4 STUB DRILL' },
  { matchType: 'keyword', matchVal: 'NO. 16 JOBBER DRILL', okuma: 83, desc: 'NO. 16 JOBBER DRILL' },
  { matchType: 'keyword', matchVal: '10-32 FORM EXTENDED LENGTH TAP RH', okuma: 84, desc: '10-32 FORM EXTENDED LENGTH TAP RH' },
  { matchType: 'serial',  matchVal: '49060',  okuma: 85, desc: 'HELICAL - 49060 - 3/16 DIA X .750 LOC - BALL EM' },
  { matchType: 'serial',  matchVal: '48620',  okuma: 86, desc: 'HELICAL - 48620 - 3/4 DIA X 1.625 LOC' },
  { matchType: 'keyword', matchVal: '.265 Diameter Slot .046 Thick', okuma: 87, desc: '.265 Diameter Slot .046 Thick' },
  { matchType: 'keyword', matchVal: '3/16 JOBBER DRILL', okuma: 88, desc: '3/16 JOBBER DRILL' },
  { matchType: 'serial',  matchVal: '01105',  okuma: 89,  desc: 'HELICAL - 01105 - 3/16 DIA X 0.5625 LOC' },
  { matchType: 'keyword', matchVal: '#18 TM RM20119 - 3/8-16 Thread Mill', okuma: 90, desc: '#18 TM RM20119 - 3/8-16 Thread Mill' },
  { matchType: 'keyword', matchVal: '1/4 STUB DRILL', okuma: 91, desc: '1/4 STUB DRILL' },
  { matchType: 'keyword', matchVal: 'NO. 56 STUB DRILL', okuma: 92, desc: 'NO. 56 STUB DRILL' },
  { matchType: 'keyword', matchVal: 'REDLINE - RE10904 -1/16 DIA X .25 LOC', okuma: 93, desc: 'REDLINE - RE10904 -1/16 DIA X .25 LOC' },
  { matchType: 'keyword', matchVal: 'NO. 30 JOBBER DRILL', altVals: ['#30 DRILL', 'NO. 30 JOBBER DRILL'], okuma: 94, desc: 'NO. 30 JOBBER DRILL' },
  { matchType: 'serial',  matchVal: '48395',  okuma: 95,  desc: 'HELICAL - 48395 - 1/2 DIA X 1.25 LOC FINISHER' },
  { matchType: 'keyword', matchVal: 'M6 X 1.0 FORM TAP RH', okuma: 96, desc: 'M6 X 1.0 FORM TAP RH' },
  { matchType: 'keyword', matchVal: '11/64 STUB DRILL', okuma: 97, desc: '11/64 STUB DRILL' },
  { matchType: 'keyword', matchVal: 'LTR. N STUB DRILL', okuma: 98, desc: 'LTR. N STUB DRILL' },
  { matchType: 'keyword', matchVal: '.395 GROUND 100 DEGREE COUNTERSINK', okuma: 100, desc: '.395 GROUND 100 DEGREE COUNTERSINK' },
  { matchType: 'keyword', matchVal: '1/4 SPOTDRILL WHITNEY 4 EXTENSION', okuma: 101, desc: '1/4 SPOTDRILL w/ Whitney 4" Extension Holder 3.0" Projection' },
  { matchType: 'keyword', matchVal: '7/32 STUB DRILL WHITNEY 4 EXTENSION', okuma: 102, desc: '7/32 STUB DRILL w/ Whitney 4" Extension Holder 3.0" Projection' },
  { matchType: 'serial',  matchVal: '19317',  okuma: 103, desc: 'HELICAL - 19317 - 1/2 DIA X 5/8 LOC X 3.3750 REACH' },
  { matchType: 'keyword', matchVal: '1/2 100 DEGREE COUNTERSINK EXTENSION', okuma: 104, desc: '1/2 100° COUNTERSINK w EXTENSION' },
  { matchType: 'keyword', matchVal: 'NO. 6-32 FORM TAP RH', okuma: 105, desc: 'NO. 6-32 FORM TAP RH' },
  { matchType: 'keyword', matchVal: 'NO. 25 JOBBER DRILL', okuma: 106, desc: 'NO. 25 JOBBER DRILL' },
  { matchType: 'serial',  matchVal: '314744', okuma: 107, desc: 'GWO - 314744 - 3/8 DIA X 1.0 LOC X .045 RAD' },
  { matchType: 'keyword', matchVal: '1/8 SPOTDRILL', okuma: 108, desc: '1/8 SPOTDRILL' },
  { matchType: 'keyword', matchVal: '1/2 90 DEGREE COUNTERSINK', okuma: 109, desc: '1/2 90 DEGREE COUNTERSINK' },
  { matchType: 'keyword', matchVal: 'NO. 16 CARBIDE JOBBER DRILL', okuma: 110, desc: 'NO. 16 CARBIDE JOBBER DRILL' },
  { matchType: 'keyword', matchVal: 'NO. 16 CARBIDE STUB DRILL', okuma: 111, desc: 'NO. 16 CARBIDE STUB DRILL' },
  { matchType: 'serial',  matchVal: '59224',  okuma: 112, desc: 'HELICAL - 59224 - 3/4 DIA X 3.250 LOC X .06 RAD' },
  { matchType: 'serial',  matchVal: '48650',  okuma: 113, desc: 'HELICAL - 48650 - 3/4 DIA X 1.625 LOC X .25 RAD' },
  { matchType: 'keyword', matchVal: '3/32 STUB DRILL', okuma: 114, desc: '3/32 STUB DRILL' },
  { matchType: 'keyword', matchVal: 'LTR. P STUB DRILL', okuma: 115, desc: 'LTR. P STUB DRILL' },
  { matchType: 'keyword', matchVal: 'M8 X 1.25 FORM BOTTOM TAP RH', okuma: 116, desc: 'M8. X 1.25 FORM BOTTOM TAP RH' },
  { matchType: 'keyword', matchVal: '.251 REAMER', okuma: 117, desc: '.251 Reamer' },
  { matchType: 'keyword', matchVal: 'NO. 25 STUB DRILL', altVals: ['#25 STUB DRILL', 'NO. 25 STUB DRILL'], okuma: 118, desc: 'NO. 25 STUB DRILL' },
  { matchType: 'keyword', matchVal: '1/4 INCH ENGRAVING TOOL 30 DEGREE', okuma: 119, desc: '1/4 INCH ENGRAVING TOOL 30 DEGREE X .015 TIP' },
  { matchType: 'serial',  matchVal: '03705',  okuma: 120, desc: 'HELICAL - 03705 - 3/4 DIA X 4.00 LOC' },
  { matchType: 'keyword', matchVal: '27/64 STUB DRILL', okuma: 121, desc: '27/64 STUB DRILL' },
  { matchType: 'keyword', matchVal: '1/2-13 UNC CARBIDE THREAD MILL', okuma: 122, desc: '#6 TM 1/2-13 UNC CARBIDE Thread Mill' },
  { matchType: 'keyword', matchVal: 'NO. 34 STUB DRILL', okuma: 123, desc: 'NO. 34 STUB DRILL' },
  { matchType: 'keyword', matchVal: '.1245 REAMER', okuma: 124, desc: '.1245 Reamer' },
  { matchType: 'keyword', matchVal: '7/8 DEMING DRILL', okuma: 125, desc: '7/8 DEMING DRILL' },
  { matchType: 'serial',  matchVal: '81415',  okuma: 126, desc: 'HELICAL - 81415 - 1/2 DIA X 2.5 LOC X UNCOATED' },
  { matchType: 'serial',  matchVal: '48150',  okuma: 127, desc: 'HELICAL - 48150 - 1/4 DIA X 1.0 LOC X .06 RAD' },
  { matchType: 'serial',  matchVal: '49040',  okuma: 128, desc: 'HELICAL - 49040 - 1/8 DIA X .500 LOC' },
  { matchType: 'serial',  matchVal: '86968',  okuma: 129, desc: 'HELICAL-86968 - 1/8 DIA X 1.0 LOC - BALL EM' },
  { matchType: 'serial',  matchVal: '987128', okuma: 131, desc: '#13 TM HARVEY - 987128-C3 - 8-32 Thread Mill' },
  { matchType: 'keyword', matchVal: '3/32 CORNER ROUND .188 PILOT', okuma: 132, desc: '3/32- CORNER ROUND W/ .188 PILOT' },
  { matchType: 'keyword', matchVal: '31/64 JOBBER DRILL', okuma: 133, desc: '31/64 JOBBER DRILL' },
  { matchType: 'keyword', matchVal: '.507 REAMER', okuma: 134, desc: '.507 REAMER' },
  { matchType: 'serial',  matchVal: '82395',  okuma: 135, desc: 'HELICAL-82395 - 3/8 DIA X 2.0 LOC' },
  { matchType: 'serial',  matchVal: '48045',  okuma: 136, desc: 'HELICAL - 48045 - 3/16 DIA X .75 LOC' },
  { matchType: 'keyword', matchVal: 'NO. 2 DRILL', okuma: 137, desc: 'NO. 2 DRILL' },
  { matchType: 'serial',  matchVal: '49065',  okuma: 138, desc: 'HELICAL - 49065 - 3/16 DIA X 1.0 LOC BALL ENDMILL' },
  { matchType: 'serial',  matchVal: '03690',  okuma: 139, desc: 'HELICAL - 03690 - 3/4 DIA X 3.25 LOC' },
  { matchType: 'serial',  matchVal: '59233',  okuma: 140, desc: 'HELICAL - 59233 - 3/4 DIA X 3.25 LOC X .25 RAD' },
  { matchType: 'serial',  matchVal: '32778',  okuma: 141, desc: 'SGS-32778- 1/2 x .750 LOC X .125 RAD' },
  { matchType: 'keyword', matchVal: '3.1MM STUB DRILL', okuma: 142, desc: '3.1MM STUB DRILL' },
  { matchType: 'keyword', matchVal: '8.0MM REAMER', okuma: 143, desc: '8.0MM REAMER - .315 DIA' },
  { matchType: 'serial',  matchVal: '82047',  okuma: 144, desc: 'HELICAL - 82047 - ROUGHER - 3/4 DIA X 3.25 LOC X .03 RAD' },
  { matchType: 'serial',  matchVal: '81537',  okuma: 145, desc: 'HELICAL - 81537 - 1/4 DIA X .375 LOC X 1.6250 REACH - BALL EM' },
  { matchType: 'keyword', matchVal: '1/32 CORNER ROUND .255 PILOT', okuma: 146, desc: '1/32- CORNER ROUND W/ .255 PILOT' },
  { matchType: 'keyword', matchVal: 'LTR. C STUB DRILL', okuma: 147, desc: 'LTR. C STUB DRILL' },
  { matchType: 'keyword', matchVal: '.252 REAMER', okuma: 148, desc: '.252 Reamer' },
  { matchType: 'keyword', matchVal: 'NO. 9 STUB DRILL', okuma: 149, desc: 'NO. 9 STUB DRILL' },
  { matchType: 'keyword', matchVal: 'LTR. I STUB DRILL', okuma: 150, desc: 'LTR. I STUB DRILL' },
  { matchType: 'keyword', matchVal: '7/32 EXTRA LONG JOBBER DRILL', okuma: 151, desc: '7/32 EXTRA LONG JOBBER DRILL' },
  { matchType: 'keyword', matchVal: 'NO. 24 STUB DRILL', okuma: 152, desc: 'NO. 24 STUB DRILL' },
  { matchType: 'keyword', matchVal: '13/64 STUB DRILL', altVals: ['13/64 DRILL'], okuma: 153, desc: '13/64 STUB DRILL' },
  { matchType: 'keyword', matchVal: '.187 X 1.140 SLOT MILL', okuma: 154, desc: '.187 X 1.140 SLOT MILL' },
  { matchType: 'keyword', matchVal: '3/8-16 CUT TAP RH', okuma: 155, desc: '3/8-16 CUT TAP RH' },
  { matchType: 'keyword', matchVal: '8-32 EXTENDED THREAD MILL', okuma: 156, desc: '#25 TM SCC2 - TMLR126-32EL- 8-32 EXTENDED THREAD MILL' },
  { matchType: 'keyword', matchVal: 'NO. 39 STUB DRILL', okuma: 157, desc: 'NO. 39 STUB DRILL' },
  { matchType: 'serial',  matchVal: '987144', okuma: 158, desc: '#7 TM HARVEY - 987144-C3 - 1/4-20 Thread Mill' },
  { matchType: 'serial',  matchVal: '48055',  okuma: 159, desc: 'HELICAL - 48055 - 3/16 DIA X .750 LOC X .03 RAD' },
  { matchType: 'keyword', matchVal: '1/4 100 DEGREE COUNTERSINK', okuma: 160, desc: '1/4 100 DEGREE COUNTERSINK' },
  { matchType: 'keyword', matchVal: '.5005 REAMER', okuma: 161, desc: '.5005 REAMER' },
  { matchType: 'keyword', matchVal: '39/64 DRILL', okuma: 162, desc: '39/64 DRILL' },
  { matchType: 'serial',  matchVal: '831960', okuma: 163, desc: 'HARVEY - 831960 -3/16 DIA X .625 LOC X .06 RAD' },
  { matchType: 'serial',  matchVal: '48405',  okuma: 164, desc: 'HELICAL - 48405 - 1/2 DIA X 1.250 LOC X .03 RAD' },
  { matchType: 'keyword', matchVal: '.250 REAMER', okuma: 165, desc: '.250 Reamer' },
  { matchType: 'keyword', matchVal: '.254 REAMER', okuma: 166, desc: '.254 Reamer' },
  { matchType: 'keyword', matchVal: 'NO. 36 STUB DRILL', altVals: ['#36 STUB DRILL'], okuma: 167, desc: 'NO. 36 STUB DRILL' },
  { matchType: 'keyword', matchVal: 'NO. 11 JOBBER DRILL', okuma: 168, desc: 'NO. 11 JOBBER DRILL' },
  { matchType: 'keyword', matchVal: 'NO. 10 STUB DRILL', okuma: 169, desc: 'NO. 10 STUB DRILL' },
  { matchType: 'keyword', matchVal: '1/4 CR .375 PILOT', okuma: 170, desc: '1/4 C.R W/.375 PILOT' },
  { matchType: 'keyword', matchVal: '.375 45 DEGREE DOVETAIL', okuma: 171, desc: '.375 45° Dovetail Cutter' },
  { matchType: 'keyword', matchVal: 'V STUB DRILL', okuma: 172, desc: 'V STUB DRILL' },
  { matchType: 'keyword', matchVal: '10-24 CUT TAP RH', okuma: 173, desc: '10-24 CUT TAP RH' },
  { matchType: 'keyword', matchVal: 'LTR. H STUB DRILL', okuma: 174, desc: 'LTR. H STUB DRILL' },
  { matchType: 'keyword', matchVal: '3/8 90 DEGREE LONG REACH SPOT DRILL', okuma: 175, desc: '3/8 90 Degree Long Reach Spot Drill' },
  { matchType: 'keyword', matchVal: '1/4-20 FORM TAP RH', okuma: 176, desc: '1/4-20 FORM TAPRH' },
  { matchType: 'keyword', matchVal: 'NO. 1 STUB DRILL', okuma: 177, desc: 'NO. 1 STUB DRILL' },
  { matchType: 'serial',  matchVal: '48030',  okuma: 178, desc: 'HELICAL - 48030 - 3/16 DIA X .375 LOC' },
  { matchType: 'keyword', matchVal: '3/4 100 DEGREE COUNTERSINK', okuma: 179, desc: '3/4 100 DEGEREE COUNTERSINK' },
  { matchType: 'keyword', matchVal: '1/16 CR .125 PILOT', okuma: 180, desc: '1/16" C.R W/.125 PILOT' },
  { matchType: 'keyword', matchVal: 'NO.17 STUB DRILL', okuma: 181, desc: 'NO.17 STUB DRILL' },
  { matchType: 'keyword', matchVal: '406 SLOT MILL', okuma: 182, desc: '406 SLOT MILL' },
  { matchType: 'keyword', matchVal: '1/2 STUB DRILL', okuma: 183, desc: '1/2 STUB DRILL' },
  { matchType: 'keyword', matchVal: 'LTR. T STUB DRILL', okuma: 184, desc: 'LTR. T STUB DRILL' },
  { matchType: 'serial',  matchVal: '48060',  okuma: 185, desc: 'HELICAL - 48060 - 5/32 DIA X 1.0 LOC' },
  { matchType: 'keyword', matchVal: 'LTR. Q STUB DRILL', okuma: 186, desc: 'LTR. Q STUB DRILL' },
  { matchType: 'keyword', matchVal: '7/32 STUB DRILL', okuma: 187, desc: '7/32 STUB DRILL' },
  { matchType: 'keyword', matchVal: '3/4 90 DEGREE SPOTDRILL', okuma: 188, desc: '3/4 90° SPOTDRILL' },
  { matchType: 'keyword', matchVal: '1/8-27 NPT THREADMILL', okuma: 189, desc: '#17 TM REDLINE - RM20202 - 1/8-27 NPT THREADMILL' },
  { matchType: 'keyword', matchVal: '7/16 JOBBER DRILL', okuma: 190, desc: '7/16 JOBBER DRILL' },
  { matchType: 'keyword', matchVal: '1/4-18 NPT THREADMILL', okuma: 191, desc: '#19 TM REDLINE - RM20205 - 1/4-18 NPT THREADMILL' },
  { matchType: 'keyword', matchVal: 'NO. 27 STUB DRILL', okuma: 192, desc: 'NO. 27 STUB DRILL' },
  { matchType: 'keyword', matchVal: '11.00MM STUB DRILL', okuma: 193, desc: '11.00mm Stub Drill' },
  { matchType: 'keyword', matchVal: 'M4 X .70 FORM TAP RH', okuma: 194, desc: 'M4 X .70 FORM TAP RH' },
  { matchType: 'serial',  matchVal: '59218',  okuma: 195, desc: 'HELICAL-59218 - 35 DEG HELIX CORNER RADIUS END MILL FOR ALUMINUM' },
  { matchType: 'keyword', matchVal: 'NO. 12 JOBBER DRILL', okuma: 196, desc: 'NO. 12 JOBBER DRILL' },
  { matchType: 'keyword', matchVal: '1/4 SPOTDRILL EXTRA LONG', okuma: 197, desc: '1/4 SPOTDRILL Extra Long' },
  { matchType: 'serial',  matchVal: '82431',  okuma: 198, desc: 'HELICAL - 82431- 3/8 DIA X 2.0 LOC x .06 RAD' },
  { matchType: 'serial',  matchVal: '81509',  okuma: 199, desc: 'HELICAL - 81509 - 3/8 DIA X .5 LOC X .06 RAD X 2.50 REACH' },
  { matchType: 'keyword', matchVal: '3/8 100 DEGREE COUNTERSINK EXTENSION 1.5', okuma: 200, desc: '3/8 100 DEGREE COUNTERSINK IN EXTENSION WITH 1.5 PROJECTION' },
  { matchType: 'keyword', matchVal: '1/2 90 DEG CHAMFER MILL', okuma: 201, desc: '1/2 90 DEG CHAMFER MILL' },
  { matchType: 'keyword', matchVal: '1/32 CORNER ROUND .265 PILOT', okuma: 202, desc: '1/32 - CORNER ROUND W/ .265 PILOT' },
  { matchType: 'keyword', matchVal: '4 INCH .125 SLITTING SAW', okuma: 203, desc: '4" X .125 SLITTING SAW' },
  { matchType: 'keyword', matchVal: 'LTR. U STUB DRILL', okuma: 204, desc: 'LTR. U STUB DRILL' },
  { matchType: 'keyword', matchVal: '.317 REAMER', okuma: 205, desc: '.317 REAMER' },
  { matchType: 'keyword', matchVal: '.381 REAMER', okuma: 206, desc: '.381 REAMER' },
  { matchType: 'keyword', matchVal: '.258 REAMER', okuma: 207, desc: '.258 -REAMER' },
  { matchType: 'keyword', matchVal: '5.7MM DRILL', okuma: 208, desc: '5.7MM DRILL' },
  { matchType: 'keyword', matchVal: 'NO. 5 STUB DRILL', okuma: 209, desc: 'NO. 5 STUB DRILL' },
  { matchType: 'keyword', matchVal: '4.40MM STUB DRILL', okuma: 210, desc: '4.40mm Stub Drill' },
  { matchType: 'keyword', matchVal: '1-12 TPI SINGLE POINT THREAD MILL', okuma: 211, desc: '#4 TM 1-12 TPI 1" Single Point Thread Mill' },
  { matchType: 'keyword', matchVal: '29/64 JOBBER DRILL', okuma: 212, desc: '29/64 JOBBER DRILL' },
  { matchType: 'keyword', matchVal: '1/2-20 CUT TAP RH', okuma: 213, desc: '1/2-20 CUT TAP RH' },
  { matchType: 'keyword', matchVal: '37/64 DEMING DRILL', okuma: 214, desc: '37/64 DEMING DRILL' },
  { matchType: 'keyword', matchVal: '5/8-18 CUT TAP RH', okuma: 215, desc: '5/8-18 CUT TAPRH' },
  { matchType: 'keyword', matchVal: '13/64 JOBBER DRILL', okuma: 216, desc: '13/64 JOBBER DRILL' },
  { matchType: 'keyword', matchVal: 'LTR. F JOBBER DRILL', okuma: 217, desc: 'LTR. F JOBBER DRILL' },
  { matchType: 'keyword', matchVal: '5/16-18 UN CARBIDE THREAD MILL', okuma: 218, desc: '#21 HAT2 836754-C6 - 5/16-18, UN, 3FL Carbide Thread Mill' },
  { matchType: 'keyword', matchVal: '5/8-11 UNC CARBIDE THREAD MILL', okuma: 219, desc: '#5 TM 5/8-11 UNC CARBIDE THREAD MILL' },
  { matchType: 'keyword', matchVal: 'LTR. K STUB DRILL', okuma: 220, desc: 'LTR. K STUB DRILL' },
  { matchType: 'serial',  matchVal: '82439',  okuma: 221, desc: 'HELICAL - 82439 - 1/2 DIA X 2.5 LOC x .06 RADIUS' },
  { matchType: 'serial',  matchVal: '82397',  okuma: 222, desc: 'HELICAL - 82397 - 1/2 DIA X 3.125 LOC' },
  { matchType: 'keyword', matchVal: '3/8 DIA 1.5 LOC LONG REACH', okuma: 223, desc: 'REDLINE - RE12325 - 3/8 DIA X 1.5 LOC WITH LONG REACH' },
  { matchType: 'keyword', matchVal: 'NO. 29 DRILL', okuma: 224, desc: 'NO. 29 DRILL' },
  { matchType: 'keyword', matchVal: '8-32 CUT TAP RH', okuma: 225, desc: '8-32 CUT TAP RH' },
  { matchType: 'keyword', matchVal: '1/2-14 NPT TAP RH', okuma: 226, desc: '1/2-14 NPT TAPRH' },
  { matchType: 'serial',  matchVal: '81499', okuma: 227, desc: 'HELICAL - 81499 - 1/4 DIA X .375 LOC X .06 RAD X 2.125 REACH' },
  { matchType: 'keyword', matchVal: '11-32 TPI SINGLE POINT THREAD MILL', okuma: 228, desc: '#2 TM 11-32 TPI 1/2" Single Point Thread Mill' },
  { matchType: 'keyword', matchVal: 'REDLINE RE10106 3/32 DIA .1875 LOC', okuma: 229, desc: 'REDLINE - RE10106 - 3/32 DIA x .1875 LOC' },
  { matchType: 'serial',  matchVal: '74362', altVals: ['0.0620 Ball endmill - HARVEY - 74362'], okuma: 230, desc: 'HARVEY - 74362 -1/16 DIA X .186 LOC BALL ENDMILL' },
  { matchType: 'keyword', matchVal: 'NO. 4-40 FORM TAP RH', okuma: 231, desc: 'NO. 4-40 FORM TAP RH' },
  { matchType: 'serial',  matchVal: '81459', okuma: 232, desc: 'HELICAL - 81459 - 1/4 DIA X 1.25 LOC BALL ENDMILL' },
  { matchType: 'keyword', matchVal: 'HAT977645 1/4 SHARP POINT CHAMFER', okuma: 233, desc: '1/4 SHARP POINT CHAMFER' },
  { matchType: 'keyword', matchVal: '7/16 100 DEG C.S', okuma: 234, desc: '7/16 100 DEG C.S' },
  { matchType: 'keyword', matchVal: '#305 -SLOT MILL', okuma: 235, desc: '#305 -SLOT MILL' },
  { matchType: 'serial',  matchVal: '48630', okuma: 236, desc: 'HELICAL - 48630 - 3/4 X 1.625 LOC X .06 RAD' },
  { matchType: 'keyword', matchVal: '.812 Seat Track', okuma: 237, desc: '.812 Seat Track' },
  { matchType: 'keyword', matchVal: '.750 Seat Track Cutter', okuma: 238, desc: '.750 Seat Track Cutter' },
  { matchType: 'keyword', matchVal: '6-32 CUT TAP RH', okuma: 239, desc: '6-32 CUT TAP RH' },
];

let toolLibrary = DEFAULT_LIBRARY.map(t => Object.assign({}, t));

let fileContent         = null;
let fileName            = null;
let pdfBytes            = null;
let pdfFileName         = null;
let currentMatchType    = 'serial';
let pdfCurrentMatchType = 'serial';
let sortCol             = 'okuma';
let sortDir             = 1; // 1 = asc, -1 = desc

// ════════════════════════════════════════
//  KEYWORD MATCHING — EXACT WHOLE MATCH
//  Both sides are normalized the same way.
//  matchVal must match the full normalized
//  tool comment string, not just be a substring.
//  This prevents NO. 7 matching NO.17 etc.
// ════════════════════════════════════════

function normalize(str) {
  return str.toUpperCase()
    .replace(/NO\.\s*(\d+)/g, 'NO$1')  // "NO. 17" → "NO17", "NO.4" → "NO4" — keeps number attached so NO4 ≠ NO17
    .replace(/LTR\.\s*([A-Z])/g, 'LTR$1') // "LTR. H" → "LTRH"
    .replace(/\.\s*/g, ' ')            // remaining dots → space
    .replace(/-/g, ' ')                // dashes → space
    .replace(/\s+/g, ' ')
    .trim();
}

function keywordMatches(entryVal, haystack) {
  // Normalize both sides the same way
  const normEntry   = normalize(entryVal);
  const normHay     = normalize(haystack);
  // Split entry into tokens and require each token to appear as a whole word
  const tokens = normEntry.split(' ').filter(t => t.length > 0);
  return tokens.every(tok => {
    // whole-word boundary check: token not preceded/followed by alphanumeric
    const re = new RegExp('(?<![A-Z0-9])' + tok.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + '(?![A-Z0-9])');
    return re.test(normHay);
  });
}

function matchesLibraryEntry(entry, text) {
  const val = (entry.matchVal || '').toUpperCase();
  if (!val) return false;
  if (entry.matchType === 'keyword') {
    if (keywordMatches(val, text)) return true;
    // Check alternate match values if provided
    if (entry.altVals && entry.altVals.length) {
      return entry.altVals.some(alt => keywordMatches(alt.toUpperCase(), text));
    }
    return false;
  } else {
    // Serial: also support altVals for alternate serial numbers
    if (text.toUpperCase().includes(val)) return true;
    if (entry.altVals && entry.altVals.length) {
      return entry.altVals.some(alt => text.toUpperCase().includes(alt.toUpperCase()));
    }
    return false;
  }
}

// ════════════════════════════════════════
//  TOOL LIBRARY PERSISTENCE
// ════════════════════════════════════════

function saveLibrary() {
  try { localStorage.setItem('okumaToolLibrary', JSON.stringify(toolLibrary)); } catch(e) {}
}

function loadLibrary() {
  try {
    const s = localStorage.getItem('okumaToolLibrary');
    if (s) {
      const parsed = JSON.parse(s);
      // Only use saved if it has content
      if (Array.isArray(parsed) && parsed.length > 0) toolLibrary = parsed;
    }
  } catch(e) {}
}

// ════════════════════════════════════════
//  TOOL TABLE RENDERING (both tabs)
// ════════════════════════════════════════

function getSortedFiltered(filter) {
  const q = (filter || '').toLowerCase();
  let rows = toolLibrary.filter(t =>
    (t.matchVal || '').toLowerCase().includes(q) ||
    (t.desc || '').toLowerCase().includes(q) ||
    String(t.okuma).includes(q)
  );
  rows.sort((a, b) => {
    let av, bv;
    if (sortCol === 'okuma')     { av = a.okuma;              bv = b.okuma; }
    else if (sortCol === 'type') { av = a.matchType;          bv = b.matchType; }
    else if (sortCol === 'val')  { av = (a.matchVal||'').toLowerCase(); bv = (b.matchVal||'').toLowerCase(); }
    else                         { av = (a.desc||'').toLowerCase();     bv = (b.desc||'').toLowerCase(); }
    if (av < bv) return -1 * sortDir;
    if (av > bv) return  1 * sortDir;
    return 0;
  });
  return rows;
}

function setSortCol(col) {
  if (sortCol === col) {
    sortDir = sortDir === 1 ? -1 : 1; // proper toggle
  } else {
    sortCol = col;
    sortDir = 1;
  }
  renderAllTables();
}

function sortIndicator(col) {
  if (sortCol !== col) return '';
  return sortDir === 1 ? ' ▲' : ' ▼';
}

function renderToolTable(bodyId, countId, filter) {
  const rows = getSortedFiltered(filter);
  const uid  = t => esc(t.matchVal + '|' + t.okuma);

  document.getElementById(bodyId).innerHTML = rows.length
    ? rows.map(t => `<tr class="lib-row">
        <td class="okuma-num" style="width:50px;">T${t.okuma}</td>
        <td class="serial">${esc(t.matchVal || '')}</td>
        <td class="desc" title="${esc(t.desc || '')}">${esc(t.desc || '—')}</td>
        <td class="lib-row-actions">
          <button class="lib-action-btn lib-edit"   onclick="editTool('${uid(t)}')"   title="Edit">&#9998;</button>
          <button class="lib-action-btn lib-delete" onclick="removeTool('${uid(t)}')" title="Remove">&#10005;</button>
        </td>
      </tr>`).join('')
    : `<tr><td colspan="4" style="color:var(--dim);text-align:center;padding:20px;">No tools found</td></tr>`;

  if (document.getElementById(countId))
    document.getElementById(countId).textContent = toolLibrary.length + ' TOOLS';
}

function renderAllTables() {
  renderToolTable('toolBody',    'toolCount',    document.getElementById('toolSearch')?.value    || '');
  renderToolTable('pdfToolBody', 'pdfToolCount', document.getElementById('pdfToolSearch')?.value || '');
  updateSortHeaders();
}

// Columns: TOOL # | MATCH VALUE | DESCRIPTION (no TYPE column)
const SORT_COLS   = ['okuma', 'val', 'desc'];
const SORT_LABELS = ['TOOL #', 'MATCH VALUE', 'DESCRIPTION'];

function updateSortHeaders() {
  ['toolBody', 'pdfToolBody'].forEach(bodyId => {
    const thead = document.getElementById(bodyId)?.closest('table')?.querySelector('thead tr');
    if (!thead) return;
    const ths = thead.querySelectorAll('th');
    SORT_COLS.forEach((col, i) => {
      if (ths[i]) ths[i].textContent = SORT_LABELS[i] + sortIndicator(col);
    });
  });
}

function removeTool(uid) {
  const idx = uid.lastIndexOf('|');
  const matchVal = uid.substring(0, idx);
  const okuma    = parseInt(uid.substring(idx + 1));
  toolLibrary = toolLibrary.filter(t => !(t.matchVal === matchVal && t.okuma === okuma));
  saveLibrary();
  renderAllTables();
  log('warn', 'Removed: ' + matchVal + ' (T' + okuma + ')');
}

// ── Inline edit ──
function editTool(uid) {
  const idx      = uid.lastIndexOf('|');
  const matchVal = uid.substring(0, idx);
  const okuma    = parseInt(uid.substring(idx + 1));
  const entry    = toolLibrary.find(t => t.matchVal === matchVal && t.okuma === okuma);
  if (!entry) return;

  const modal = document.createElement('div');
  modal.id = 'editModal';
  modal.style.cssText = 'position:fixed;inset:0;z-index:99990;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;padding:20px;';
  modal.innerHTML = `
    <div style="background:var(--panel);border:1px solid var(--border);border-radius:6px;width:100%;max-width:520px;padding:24px;display:flex;flex-direction:column;gap:16px;">
      <div style="font-family:var(--sans);font-size:18px;font-weight:700;letter-spacing:2px;color:var(--accent);">EDIT TOOL</div>
      <div style="display:flex;gap:8px;">
        <button id="editBtnSerial"  onclick="editSetType('serial')"
          style="flex:1;padding:7px;border-radius:3px;border:1px solid var(--orange);background:var(--orange);color:#000;font-family:var(--sans);font-size:12px;font-weight:700;letter-spacing:1px;cursor:pointer;">SERIAL #</button>
        <button id="editBtnKeyword" onclick="editSetType('keyword')"
          style="flex:1;padding:7px;border-radius:3px;border:1px solid var(--border);background:transparent;color:var(--dim);font-family:var(--sans);font-size:12px;font-weight:700;letter-spacing:1px;cursor:pointer;">KEYWORD</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:4px;">
        <label style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--dim);" id="editMatchLabel">Serial Number / Keyword</label>
        <input id="editMatchVal" value="${esc(entry.matchVal)}"
          style="background:var(--bg);border:1px solid var(--border);color:var(--text);font-family:var(--mono);font-size:13px;padding:8px 10px;border-radius:3px;outline:none;width:100%;">
      </div>
      <div style="display:flex;flex-direction:column;gap:4px;">
        <label style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--dim);">Okuma Tool #</label>
        <input id="editOkuma" type="number" value="${entry.okuma}" min="1"
          style="background:var(--bg);border:1px solid var(--border);color:var(--accent);font-family:var(--mono);font-size:18px;padding:6px 10px;border-radius:3px;outline:none;width:100%;text-align:center;">
      </div>
      <div style="display:flex;flex-direction:column;gap:4px;">
        <label style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--dim);">Description</label>
        <input id="editDesc" value="${esc(entry.desc || '')}"
          style="background:var(--bg);border:1px solid var(--border);color:var(--text);font-family:var(--mono);font-size:13px;padding:8px 10px;border-radius:3px;outline:none;width:100%;">
      </div>
      <div style="display:flex;gap:10px;justify-content:flex-end;">
        <button onclick="document.getElementById('editModal').remove()"
          style="padding:10px 20px;background:transparent;border:1px solid var(--border);color:var(--text);font-family:var(--sans);font-size:14px;font-weight:700;letter-spacing:1px;border-radius:3px;cursor:pointer;">CANCEL</button>
        <button onclick="saveEditTool('${esc(matchVal)}',${okuma})"
          style="padding:10px 24px;background:var(--green);border:none;color:#000;font-family:var(--sans);font-size:14px;font-weight:700;letter-spacing:1px;border-radius:3px;cursor:pointer;">SAVE</button>
      </div>
    </div>`;
  document.body.appendChild(modal);

  // Set initial type state
  modal._editType = entry.matchType;
  editSetType(entry.matchType);
}

function editSetType(type) {
  const modal = document.getElementById('editModal');
  if (!modal) return;
  modal._editType = type;
  const isSer = type === 'serial';
  const btnS  = document.getElementById('editBtnSerial');
  const btnK  = document.getElementById('editBtnKeyword');
  btnS.style.background  = isSer ? 'var(--orange)' : 'transparent';
  btnS.style.color       = isSer ? '#000' : 'var(--dim)';
  btnS.style.borderColor = isSer ? 'var(--orange)' : 'var(--border)';
  btnK.style.background  = !isSer ? 'var(--accent)' : 'transparent';
  btnK.style.color       = !isSer ? '#000' : 'var(--dim)';
  btnK.style.borderColor = !isSer ? 'var(--accent)' : 'var(--border)';
  document.getElementById('editMatchLabel').textContent = isSer ? 'Serial Number' : 'Keyword / Phrase';
}

function saveEditTool(origMatchVal, origOkuma) {
  const modal    = document.getElementById('editModal');
  const newVal   = document.getElementById('editMatchVal').value.trim();
  const newOkuma = parseInt(document.getElementById('editOkuma').value);
  const newDesc  = document.getElementById('editDesc').value.trim();
  const newType  = modal._editType;
  if (!newVal)           { alert('Match value is required.'); return; }
  if (!newOkuma||newOkuma<1) { alert('Tool number is required.'); return; }
  const i = toolLibrary.findIndex(t => t.matchVal === origMatchVal && t.okuma === origOkuma);
  if (i === -1) { alert('Tool not found.'); return; }
  toolLibrary[i] = { matchType: newType, matchVal: newVal, okuma: newOkuma, desc: newDesc };
  saveLibrary();
  renderAllTables();
  modal.remove();
  log('ok', 'Updated: ' + newVal + ' → T' + newOkuma);
}

// ════════════════════════════════════════
//  MATCH TYPE TOGGLES
// ════════════════════════════════════════

function setMatchType(type) {
  currentMatchType = type;
  const isSer = type === 'serial';
  document.getElementById('btnSerial').classList.toggle('active', isSer);
  document.getElementById('btnKeyword').classList.toggle('active', !isSer);
  document.getElementById('matchHint').textContent       = isSer ? 'SERIAL: exact number in tool comment (e.g. 48410)' : 'KEYWORD: phrase matched in tool comment';
  document.getElementById('matchValLabel').textContent   = isSer ? 'Serial Number' : 'Keyword / Phrase';
  document.getElementById('newSerial').placeholder       = isSer ? 'e.g. 48410' : 'e.g. NO. 40 STUB DRILL';
}

function setPdfMatchType(type) {
  pdfCurrentMatchType = type;
  const isSer = type === 'serial';
  document.getElementById('pdfBtnSerial').classList.toggle('active', isSer);
  document.getElementById('pdfBtnKeyword').classList.toggle('active', !isSer);
  document.getElementById('pdfMatchHint').textContent    = isSer ? 'SERIAL: exact number in tool comment (e.g. 48410)' : 'KEYWORD: phrase matched in tool comment';
  document.getElementById('pdfMatchValLabel').textContent = isSer ? 'Serial Number' : 'Keyword / Phrase';
  document.getElementById('pdfNewSerial').placeholder    = isSer ? 'e.g. 48410' : 'e.g. NO. 40 STUB DRILL';
}

// ════════════════════════════════════════
//  ADD TOOL FORMS
// ════════════════════════════════════════

function toggleAddForm()    { document.getElementById('addToolForm').classList.toggle('open'); }
function togglePdfAddForm() { document.getElementById('pdfAddToolForm').classList.toggle('open'); }

function _addToolEntry(matchType, matchVal, okuma, desc, logFn, clearIds) {
  if (!matchVal)         { alert('Serial number or keyword is required.'); return; }
  if (!okuma || okuma<1) { alert('Okuma tool number is required.'); return; }
  if (toolLibrary.find(t => t.matchVal === matchVal && t.okuma === okuma)) {
    alert('This entry already exists.'); return;
  }
  toolLibrary.push({ matchType, matchVal, okuma, desc });
  saveLibrary();
  renderAllTables();
  clearIds.forEach(id => { document.getElementById(id).value = ''; });
  logFn('ok', 'Added: ' + matchVal + ' → T' + okuma);
}

function addTool() {
  _addToolEntry(
    currentMatchType,
    document.getElementById('newSerial').value.trim(),
    parseInt(document.getElementById('newOkuma').value),
    document.getElementById('newDesc').value.trim(),
    log, ['newSerial','newOkuma','newDesc']
  );
}

function addToolFromPdfTab() {
  _addToolEntry(
    pdfCurrentMatchType,
    document.getElementById('pdfNewSerial').value.trim(),
    parseInt(document.getElementById('pdfNewOkuma').value),
    document.getElementById('pdfNewDesc').value.trim(),
    pdfLog, ['pdfNewSerial','pdfNewOkuma','pdfNewDesc']
  );
}

// ════════════════════════════════════════
//  EXPORT / IMPORT
// ════════════════════════════════════════

function exportLibrary() {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(toolLibrary, null, 2)], { type: 'application/json' }));
  a.download = 'okuma_tool_library.json';
  a.click();
}

// Single import handler — .json = library, .html = Mastercam report
function handleImport(e) {
  const file = e.target.files[0];
  if (!file) return;
  const name   = file.name.toLowerCase();
  const reader = new FileReader();
  if (name.endsWith('.json')) {
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!Array.isArray(data)) throw new Error('Expected JSON array');
        toolLibrary = data;
        saveLibrary();
        renderAllTables();
        log('ok', 'Imported ' + data.length + ' tools from ' + file.name);
      } catch(err) { log('error', 'Import failed: ' + err.message); }
    };
    reader.readAsText(file);
  } else if (name.endsWith('.html') || name.endsWith('.htm')) {
    reader.onload = ev => {
      try {
        const tools = parseMastercamReport(ev.target.result);
        showMcImportPreview(tools);
      } catch(err) {
        log('error', 'Mastercam import failed: ' + err.message);
        console.error(err);
      }
    };
    reader.readAsText(file);
  } else {
    alert('Unsupported file. Use .json for library backup or .html for Mastercam Detail Report.');
  }
  e.target.value = '';
}

// ════════════════════════════════════════
//  MASTERCAM HTML REPORT PARSER
// ════════════════════════════════════════

function parseMastercamReport(html) {
  const parser    = new DOMParser();
  const doc       = parser.parseFromString(html, 'text/html');
  const pages     = doc.querySelectorAll('div[style*="position:relative"]');
  const allTools  = [];
  const seenTools = new Set();

  const NUMBER_LEFT   = 0.076;
  const TOOLNAME_LEFT = 0.514;
  const DIA_LEFT      = 2.764;
  const RAD_LEFT      = 3.364;
  const TOLERANCE     = 0.04;

  for (const page of pages) {
    const items = [];
    for (const span of page.querySelectorAll('span')) {
      const style = span.getAttribute('style') || '';
      const topM  = style.match(/top:([\d.]+)in/);
      const leftM = style.match(/left:([\d.]+)in/);
      if (!topM || !leftM) continue;
      const text = span.textContent.replace(/\s+/g, ' ').trim();
      if (!text) continue;
      items.push({ top: parseFloat(topM[1]), left: parseFloat(leftM[1]), text });
    }
    items.sort((a, b) => a.top - b.top || a.left - b.left);

    const numItems = items.filter(i =>
      Math.abs(i.left - NUMBER_LEFT) < TOLERANCE && /^\d+$/.test(i.text)
    );

    for (const ni of numItems) {
      const toolNum = parseInt(ni.text);
      if (toolNum === 0 || seenTools.has(toolNum)) continue;

      const nameItem = items.find(i =>
        Math.abs(i.left - TOOLNAME_LEFT) < TOLERANCE &&
        Math.abs(i.top - ni.top) < 0.03
      );
      if (!nameItem || nameItem.text.length < 3) continue;
      seenTools.add(toolNum);

      const toolName    = nameItem.text;
      const serialMatch = toolName.match(/-\s*(\d{4,6})\s*-/);
      const serial      = serialMatch ? serialMatch[1] : null;

      const diaItem = items.find(i => Math.abs(i.left - DIA_LEFT) < TOLERANCE && Math.abs(i.top - ni.top) < 0.03);
      const radItem = items.find(i => Math.abs(i.left - RAD_LEFT) < TOLERANCE && Math.abs(i.top - ni.top) < 0.03);

      allTools.push({ toolNum, toolName, serial,
        dia: diaItem ? parseFloat(diaItem.text) : null,
        rad: radItem ? parseFloat(radItem.text)  : null });
    }
  }
  allTools.sort((a, b) => a.toolNum - b.toolNum);
  return allTools;
}

function normalizeMcName(str) {
  // For Mastercam import: strip dashes, dots, collapse spaces, uppercase
  return str.toUpperCase().replace(/\./g,' ').replace(/-/g,' ').replace(/\s+/g,' ').trim();
}

function showMcImportPreview(tools) {
  const existing = document.getElementById('mcPreviewModal');
  if (existing) existing.remove();

  const isDuplicate = t => {
    const val = t.serial || normalizeMcName(t.toolName);
    return toolLibrary.some(e => e.okuma === t.toolNum && e.matchVal === val);
  };
  const newTools   = tools.filter(t => !isDuplicate(t));
  const serialCnt  = tools.filter(t => t.serial).length;
  const keywordCnt = tools.length - serialCnt;

  const rows = tools.map(t => {
    const dup      = isDuplicate(t);
    const isSer    = !!t.serial;
    const typeCol  = isSer ? 'var(--orange)' : 'var(--accent)';
    const typeLabel= isSer ? 'SERIAL'        : 'KEYWORD';
    const val      = t.serial || normalizeMcName(t.toolName);
    return `<tr style="${dup ? 'opacity:0.4;' : ''}">
      <td style="padding:5px 8px;font-family:var(--mono);font-size:11px;color:var(--accent);">T${t.toolNum}</td>
      <td style="padding:5px 8px;"><span style="font-size:9px;font-weight:700;padding:2px 5px;border-radius:2px;border:1px solid ${typeCol};color:${typeCol};">${typeLabel}</span></td>
      <td style="padding:5px 8px;font-family:var(--mono);font-size:10px;color:var(--dim);">${esc(t.toolName)}</td>
      <td style="padding:5px 8px;font-family:var(--mono);font-size:10px;color:var(--text);">${esc(val)}${dup ? ' <span style="color:var(--yellow);font-size:9px;">ALREADY IN LIBRARY</span>' : ''}</td>
    </tr>`;
  }).join('');

  const modal = document.createElement('div');
  modal.id = 'mcPreviewModal';
  modal.style.cssText = 'position:fixed;inset:0;z-index:99990;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;padding:20px;';
  modal.innerHTML = `
    <div style="background:var(--panel);border:1px solid var(--border);border-radius:6px;width:100%;max-width:900px;max-height:85vh;display:flex;flex-direction:column;overflow:hidden;">
      <div style="padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
        <div style="font-family:var(--sans);font-size:18px;font-weight:700;letter-spacing:2px;color:var(--accent);">MASTERCAM IMPORT PREVIEW</div>
        <div style="font-family:var(--mono);font-size:11px;color:var(--dim);margin-left:auto;">
          ${tools.length} tools &nbsp;·&nbsp;
          <span style="color:var(--orange);">${serialCnt} serial</span> &nbsp;·&nbsp;
          <span style="color:var(--accent);">${keywordCnt} keyword</span> &nbsp;·&nbsp;
          <span style="color:var(--green);">${newTools.length} new</span>
        </div>
      </div>
      <div style="overflow-y:auto;flex:1;">
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="border-bottom:1px solid var(--border);">
              <th style="padding:8px;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--dim);text-align:left;">TOOL #</th>
              <th style="padding:8px;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--dim);text-align:left;">TYPE</th>
              <th style="padding:8px;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--dim);text-align:left;">TOOL NAME</th>
              <th style="padding:8px;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--dim);text-align:left;">MATCH VALUE</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <div style="padding:14px 20px;border-top:1px solid var(--border);display:flex;gap:10px;justify-content:flex-end;">
        <button onclick="document.getElementById('mcPreviewModal').remove()"
          style="padding:10px 20px;background:transparent;border:1px solid var(--border);color:var(--text);font-family:var(--sans);font-size:14px;font-weight:700;letter-spacing:1px;border-radius:3px;cursor:pointer;">CANCEL</button>
        <button onclick="confirmMcImport()"
          style="padding:10px 24px;background:var(--green);border:none;color:#000;font-family:var(--sans);font-size:14px;font-weight:700;letter-spacing:1px;border-radius:3px;cursor:pointer;">ADD ${newTools.length} NEW TOOLS</button>
      </div>
    </div>`;
  modal._tools = tools;
  document.body.appendChild(modal);
}

function confirmMcImport() {
  const modal = document.getElementById('mcPreviewModal');
  if (!modal) return;
  let added = 0;
  for (const t of modal._tools) {
    const matchType = t.serial ? 'serial' : 'keyword';
    const matchVal  = t.serial || normalizeMcName(t.toolName);
    if (toolLibrary.some(e => e.okuma === t.toolNum && e.matchVal === matchVal)) continue;
    toolLibrary.push({ matchType, matchVal, okuma: t.toolNum, desc: t.toolName });
    added++;
  }
  saveLibrary();
  renderAllTables();
  modal.remove();
  log('ok', 'Imported ' + added + ' tools from Mastercam report');
}

// ════════════════════════════════════════
//  SEARCH & TAB SWITCHING
// ════════════════════════════════════════

document.addEventListener('input', e => {
  if (e.target.id === 'toolSearch')    renderToolTable('toolBody',    'toolCount',    e.target.value);
  if (e.target.id === 'pdfToolSearch') renderToolTable('pdfToolBody', 'pdfToolCount', e.target.value);
});

// Make table headers clickable for sort
document.addEventListener('click', e => {
  const th = e.target.closest('th');
  if (!th) return;
  const thead = th.closest('thead');
  if (!thead) return;
  const ths    = [...thead.querySelectorAll('th')];
  const colIdx = ths.indexOf(th);
  if (colIdx >= 0 && colIdx < SORT_COLS.length) setSortCol(SORT_COLS[colIdx]);
});

function switchConvTab(name) {
  document.querySelectorAll('.conv-tab-pane').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.conv-tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('ctab-' + name + '-pane').classList.add('active');
  document.getElementById('ctab-' + name).classList.add('active');
}

// ════════════════════════════════════════
//  G-CODE FILE HANDLING — MULTI FILE
// ════════════════════════════════════════

let pendingFiles  = []; // { name, content } queued for batch convert
let resultCards   = []; // converted result objects
let currentCard   = 0;

(function() {
  const dz = document.getElementById('dropZone');
  const fi = document.getElementById('fileInput');
  dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('drag-over'); });
  dz.addEventListener('dragleave', () => dz.classList.remove('drag-over'));
  dz.addEventListener('drop', e => {
    e.preventDefault(); dz.classList.remove('drag-over');
    if (e.dataTransfer.files.length) handleFiles(Array.from(e.dataTransfer.files));
  });
  fi.addEventListener('change', e => {
    if (e.target.files.length) handleFiles(Array.from(e.target.files));
  });
})();

function handleFiles(files) {
  pendingFiles = [];
  let loaded = 0;
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = ev => {
      pendingFiles.push({ name: file.name, content: ev.target.result, size: file.size });
      loaded++;
      if (loaded === files.length) {
        pendingFiles.sort((a,b) => a.name.localeCompare(b.name));
        updateDropZoneMulti();
        document.getElementById('convertBtn').disabled = false;
      }
    };
    reader.readAsText(file);
  });
}

function updateDropZoneMulti() {
  const count = pendingFiles.length;
  const names = pendingFiles.map(f => esc(f.name)).join('<br>');
  document.getElementById('dropZone').innerHTML = `
    <input type="file" id="fileInput" accept=".min,.MIN,.nc,.NC,.txt" multiple>
    <div class="file-loaded">
      <div class="file-name">&#10004; ${count} file${count>1?'s':''} ready</div>
      <div class="file-meta" style="margin-top:6px;line-height:1.8;">${names}</div>
      <div class="file-change">Click to change files</div>
    </div>`;
  document.getElementById('fileInput').addEventListener('change', e => {
    if (e.target.files.length) handleFiles(Array.from(e.target.files));
  });
}

// ════════════════════════════════════════
//  LOGGING (single status log, not per-card)
// ════════════════════════════════════════

function log(type, msg) {
  const box  = document.getElementById('logBox');
  const span = document.createElement('span');
  span.className   = 'log-' + type;
  span.textContent = '[' + new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',second:'2-digit'}) + '] ' + msg + '\n';
  box.appendChild(span); box.scrollTop = box.scrollHeight;
}

function pdfLog(type, msg) {
  const box  = document.getElementById('pdfLogBox');
  const span = document.createElement('span');
  span.className   = 'log-' + type;
  span.textContent = '[' + new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',second:'2-digit'}) + '] ' + msg + '\n';
  box.appendChild(span); box.scrollTop = box.scrollHeight;
}

function clearResults() {
  resultCards = []; currentCard = 0;
  document.getElementById('cardDeck').innerHTML = '';
  document.getElementById('cardDeck').style.display = 'none';
  document.getElementById('emptyState').style.display = 'block';
  document.getElementById('logBox').innerHTML = '';
}

// ════════════════════════════════════════
//  G-CODE CONVERSION ENGINE
// ════════════════════════════════════════

// Pure conversion — takes text string, returns result object
function convertGCode(content, fname, wcsInc) {
  const lines    = content.split('\n');
  const toolMap  = {};
  const sameTools = new Set(); // tNums where Haas# already == Okuma#
  const unmapped = [];
  const logLines = [];
  const headerRe = /^\(T(\d+)\s*[-–]/i;

  const addLog = (type, msg) => logLines.push({ type, msg });

  addLog('info', '══════════════════════════════════════════');
  addLog('info', ' ' + fname);
  addLog('info', '══════════════════════════════════════════');
  addLog('info', 'Scanning header...');

  for (const line of lines) {
    const s = line.trim();
    if (!s.startsWith('(')) continue;
    const m = s.match(headerRe);
    if (!m) continue;
    const tNum = m[1];
    let matched = false;
    for (const entry of toolLibrary) {
      if (matchesLibraryEntry(entry, s)) {
        toolMap[tNum] = entry.okuma;
        if (String(tNum) === String(entry.okuma)) {
          sameTools.add(tNum);
          addLog('same', '  T' + tNum + ' → T' + entry.okuma + '  [' + entry.matchVal + '] ✓ already correct');
        } else {
          addLog('map', '  T' + tNum + ' → T' + entry.okuma + '  [' + entry.matchVal + ']');
        }
        matched = true; break;
      }
    }
    if (!matched && /T\d+\s*[-–].{4,}/.test(s)) unmapped.push({ tNum, line: s });
  }

  if (unmapped.length) {
    addLog('warn', unmapped.length + ' tool(s) not in library:');
    unmapped.forEach(u => addLog('warn', '  T' + u.tNum + ': ' + u.line));
  }

  addLog('info', 'Converting... (WCS +' + wcsInc + ')');
  const origLines = [], convLines = [];
  let wcsCount = 0, toolCount = 0;

  for (const rawLine of lines) {
    const orig      = rawLine.replace(/\r$/, '');
    let conv        = orig;
    const isComment = orig.trim().startsWith('(');

    conv = conv.replace(/G15\s+H(\d+)/g, (_, h) => { wcsCount++; return 'G15 H' + (parseInt(h) + wcsInc); });

    if (!isComment) {
      conv = conv.replace(/\bT(\d+)\b/g, (match, tNum) => {
        if (toolMap[tNum] !== undefined) { toolCount++; return 'T' + toolMap[tNum]; }
        return match;
      });
    } else {
      conv = conv.replace(/^\(T(\d+)([\s\-])/, (match, tNum, sep) => {
        if (toolMap[tNum] !== undefined) return '(T' + toolMap[tNum] + sep;
        return match;
      });
      conv = conv.replace(/([\-\s]+H)(\d+)(\s*\))\s*$/, (match, prefix, hNum, suffix) => {
        if (toolMap[hNum] !== undefined) return prefix + toolMap[hNum] + suffix;
        return match;
      });
    }

    const changed = conv !== orig;
    // Detect lines where tool number didn't actually change (already correct pocket)
    const isSameTool = changed && (() => {
      const origT = orig.match(/\bT(\d+)\b/);
      const convT = conv.match(/\bT(\d+)\b/);
      return origT && convT && origT[1] === convT[1] && sameTools.has(origT[1]);
    })();
    origLines.push({ text: orig, changed, same: isSameTool });
    convLines.push({ text: conv, changed, same: isSameTool });
  }

  const convertedText = convLines.map(l => l.text).join('\n');
  const changedCount  = convLines.filter(l => l.changed).length;

  addLog('ok', ' DONE — ' + lines.length.toLocaleString() + ' lines processed');
  addLog('ok', '   WCS changed  : ' + wcsCount);
  addLog('ok', '   Tools changed: ' + toolCount);
  addLog('ok', '   Lines changed: ' + changedCount);
  if (unmapped.length) addLog('warn', '   Unmapped     : ' + unmapped.length);

  const outName = fname.replace(/\.[^.]+$/, '') + '_OKUMA.MIN';
  const url     = URL.createObjectURL(new Blob([convertedText], { type: 'text/plain' }));

  return {
    fname, outName, url,
    lines: lines.length, wcsCount, toolCount,
    changedCount, unmappedCount: unmapped.length,
    origLines, convLines, logLines
  };
}

function runConversion() {
  if (!pendingFiles.length) { alert('Please upload .MIN files first.'); return; }

  document.getElementById('logBox').innerHTML = '';
  document.getElementById('emptyState').style.display = 'none';

  const _wcsRaw = document.getElementById('wcsIncrement').value;
  const wcsInc  = _wcsRaw !== '' ? parseInt(_wcsRaw) : 1;

  resultCards  = pendingFiles.map(f => convertGCode(f.content, f.name, wcsInc));
  currentCard  = 0;

  // Print summary to status log
  log('info', 'Converted ' + resultCards.length + ' file(s)');
  resultCards.forEach(r => {
    log(r.unmappedCount > 0 ? 'warn' : 'ok',
      r.fname + '  →  ' + r.changedCount + ' lines changed' +
      (r.unmappedCount ? '  (' + r.unmappedCount + ' unmapped)' : ''));
  });

  renderCardDeck();
}

// ── Card deck renderer ──
function renderCardDeck() {
  const deck = document.getElementById('cardDeck');
  deck.style.display = 'flex';

  if (resultCards.length === 0) { deck.innerHTML = ''; return; }

  const r    = resultCards[currentCard];
  const total = resultCards.length;

  const buildHtml = arr => arr.slice(0, 300).map(l =>
    '<span class="' + (l.same ? 'line-same' : l.changed ? 'line-changed' : 'line-normal') + '">' + esc(l.text) + '</span>'
  ).join('');

  const logHtml = r.logLines.map(l =>
    '<span class="log-' + l.type + '">' + esc(l.msg) + '\n</span>'
  ).join('');

  deck.innerHTML = `
    <!-- Download bar -->
    <div class="download-bar show">
      <div class="dl-info">CONVERSION COMPLETE<span>${esc(r.outName)} &nbsp;·&nbsp; ${r.changedCount} lines modified</span></div>
      ${total > 1
        ? `<button class="btn-download" onclick="downloadAll()">&#11015; DOWNLOAD ALL (${total})</button>`
        : `<a class="btn-download" href="${r.url}" download="${esc(r.outName)}">&#11015; DOWNLOAD .MIN</a>`
      }
    </div>

    <!-- Stats -->
    <div class="stats-row">
      <div class="stat-box"><div class="stat-val ok">${r.lines.toLocaleString()}</div><div class="stat-label">Total Lines</div></div>
      <div class="stat-box"><div class="stat-val">${r.wcsCount}</div><div class="stat-label">WCS Changed</div></div>
      <div class="stat-box"><div class="stat-val">${r.toolCount}</div><div class="stat-label">Tools Remapped</div></div>
      <div class="stat-box"><div class="stat-val warn">${r.unmappedCount}</div><div class="stat-label">Unmapped Tools</div></div>
    </div>

    <!-- Per-card log -->
    <div class="panel">
      <div class="panel-head"><div class="dot"></div>CONVERSION LOG</div>
      <div class="panel-body" style="padding:0;">
        <div class="log-box" style="max-height:160px;">${logHtml}</div>
      </div>
    </div>

    <!-- Side-by-side preview + card nav combined -->
    <div class="panel">
      <div class="panel-head">
        <div class="dot"></div>SIDE-BY-SIDE PREVIEW
        <span style="color:var(--dim);font-size:10px;margin-left:8px;">(CHANGED LINES HIGHLIGHTED)</span>
      </div>
      ${total > 1 ? `
      <div class="card-nav">
        <button class="card-nav-btn" onclick="navigateCard(-1)" ${currentCard===0?'disabled':''}>&#8592;</button>
        <span class="card-nav-label">
          <span class="card-nav-counter">FILE ${currentCard+1} OF ${total} &nbsp;·&nbsp; CLICK ARROWS TO SWITCH</span>
          <span class="card-nav-filename">${esc(r.fname)}</span>
        </span>
        <button class="card-nav-btn" onclick="navigateCard(1)" ${currentCard===total-1?'disabled':''}>&#8594;</button>
        <a class="card-nav-download" href="${r.url}" download="${esc(r.outName)}">&#11015; ${esc(r.outName)}</a>
      </div>` : ''}
      <div class="code-compare">
        <div class="code-pane">
          <div class="code-pane-head orig">&#9658; ORIGINAL (HAAS)</div>
          <div class="code-scroll" id="origCode">${buildHtml(r.origLines)}</div>
        </div>
        <div class="code-pane">
          <div class="code-pane-head conv">&#9658; CONVERTED (OKUMA)</div>
          <div class="code-scroll" id="convCode">${buildHtml(r.convLines)}</div>
        </div>
      </div>
    </div>`;

  // Sync scroll between panes
  const panes = deck.querySelectorAll('.code-scroll');
  panes.forEach(p => { p.onscroll = () => panes.forEach(o => { if (o !== p) o.scrollTop = p.scrollTop; }); });
}

function navigateCard(dir) {
  currentCard = Math.max(0, Math.min(resultCards.length - 1, currentCard + dir));
  renderCardDeck();
}

function downloadAll() {
  // Trigger individual downloads with a small delay between each
  // so the browser doesn't block them as a popup flood
  resultCards.forEach((r, i) => {
    setTimeout(() => {
      const a = document.createElement('a');
      a.href     = r.url;
      a.download = r.outName;
      a.click();
    }, i * 200);
  });
}

(function() {
  const dz = document.getElementById('pdfDropZone');
  const fi = document.getElementById('pdfFileInput');
  dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('drag-over'); });
  dz.addEventListener('dragleave', () => dz.classList.remove('drag-over'));
  dz.addEventListener('drop', e => { e.preventDefault(); dz.classList.remove('drag-over'); if (e.dataTransfer.files[0]) handlePdfFile(e.dataTransfer.files[0]); });
  fi.addEventListener('change', e => { if (e.target.files[0]) handlePdfFile(e.target.files[0]); });
})();

function handlePdfFile(file) {
  pdfFileName = file.name;
  const reader = new FileReader();
  reader.onload = ev => {
    pdfBytes = new Uint8Array(ev.target.result);
    document.getElementById('pdfDropZone').innerHTML = `
      <input type="file" id="pdfFileInput" accept=".pdf,.PDF">
      <div class="file-loaded">
        <div class="file-name">&#10004; ${esc(file.name)}</div>
        <div class="file-meta">${(file.size/1024).toFixed(1)} KB</div>
        <div class="file-change">Click to change file</div>
      </div>`;
    document.getElementById('pdfFileInput').addEventListener('change', e => { if (e.target.files[0]) handlePdfFile(e.target.files[0]); });
    document.getElementById('pdfConvertBtn').disabled    = false;
    document.getElementById('pdfLogBox').innerHTML       = '';
    pdfLog('ok', 'Loaded: ' + file.name);
    document.getElementById('pdfDownloadBar').classList.remove('show');
    document.getElementById('pdfStatsRow').style.display    = 'none';
    document.getElementById('pdfPreviewPanel').style.display = 'none';
    document.getElementById('pdfEmptyState').style.display   = 'block';
  };
  reader.readAsArrayBuffer(file);
}

// ════════════════════════════════════════
//  LOGGING

// ════════════════════════════════════════
//  PDF CONVERSION ENGINE
// ════════════════════════════════════════

async function runPdfConversion() {
  if (!pdfBytes) { alert('Please upload a PDF first.'); return; }
  const btn = document.getElementById('pdfConvertBtn');
  btn.disabled = true; btn.innerHTML = 'PROCESSING...';
  document.getElementById('pdfLogBox').innerHTML = '';
  pdfLog('info', '══════════════════════════════════════════');
  pdfLog('info', ' STARTING PDF CONVERSION');
  pdfLog('info', '══════════════════════════════════════════');

  try {
    const { PDFDocument, rgb, StandardFonts } = window.PDFLib;
    const woInc = parseInt(document.getElementById('pdfWoIncrement').value) || 0;

    pdfLog('info', 'Extracting text positions...');
    const pdfDoc   = await pdfjsLib.getDocument({ data: pdfBytes.slice() }).promise;
    const numPages = pdfDoc.numPages;
    pdfLog('info', 'PDF has ' + numPages + ' pages.');

    const allWords = [];
    for (let pi = 0; pi < numPages; pi++) {
      const page    = await pdfDoc.getPage(pi + 1);
      const vp      = page.getViewport({ scale: 1.0 });
      const content = await page.getTextContent();
      const pageH   = vp.height;
      for (const item of content.items) {
        if (!item.str || !item.str.trim()) continue;
        const x = item.transform[4];
        const y = item.transform[5];
        const h = item.height || 8;
        const tokens = item.str.split(/(\s+)/);
        let curX = x;
        for (const tok of tokens) {
          if (tok.trim().length === 0) { curX += (item.width / Math.max(item.str.length,1)) * tok.length; continue; }
          const tokW = (item.width / Math.max(item.str.length,1)) * tok.length;
          allWords.push({ text: tok.trim(), x: curX, y, w: tokW, h, fontSize: h, pageIndex: pi, pageH });
          curX += tokW + (item.width / Math.max(item.str.length,1));
        }
      }
    }
    pdfLog('info', 'Extracted ' + allWords.length + ' tokens across ' + numPages + ' pages.');

    const lineMap = {};
    for (const w of allWords) {
      const key = w.pageIndex + '_' + Math.round(w.y);
      if (!lineMap[key]) lineMap[key] = [];
      lineMap[key].push(w);
    }
    const lines = Object.keys(lineMap)
      .sort((a,b) => { const [pa,ya]=a.split('_').map(Number); const [pb,yb]=b.split('_').map(Number); return pa!==pb?pa-pb:yb-ya; })
      .map(key => ({ key, words: lineMap[key].sort((a,b)=>a.x-b.x), text: lineMap[key].sort((a,b)=>a.x-b.x).map(w=>w.text).join(' ') }));

    const mcamToOkuma = {};
    pdfLog('info', 'Matching tools...');

    for (let li = 0; li < lines.length; li++) {
      const curTxt = lines[li].text.trim();
      const [curPage, curY] = lines[li].key.split('_').map(Number);
      const mH = curTxt.match(/^#\s*(\d+)\s*$/);
      if (!mH) continue;
      const mcamNum = mH[1];
      if (mcamToOkuma[mcamNum]) continue;
      for (let lj = 0; lj < lines.length; lj++) {
        if (lj === li) continue;
        const [pg2, y2] = lines[lj].key.split('_').map(Number);
        if (pg2 !== curPage || Math.abs(y2 - curY) > 15) continue;
        const txt = lines[lj].text.trim();
        if (txt.length < 5 || /^(STICKOUT|TOOL LIST|OPERATION LIST|PART CYCLE|PROGRAM NUMBER)/i.test(txt)) continue;
        for (const entry of toolLibrary) {
          if (matchesLibraryEntry(entry, txt)) {
            mcamToOkuma[mcamNum] = String(entry.okuma);
            pdfLog('map', '  #' + mcamNum + ' → T' + entry.okuma + '  [' + entry.matchVal + ']  txt:"' + txt.substring(0,50) + '"');
            break;
          }
        }
        if (mcamToOkuma[mcamNum]) break;
      }
      if (!mcamToOkuma[mcamNum]) pdfLog('warn', '  #' + mcamNum + ' not matched');
    }

    for (let li = 0; li < lines.length; li++) {
      const mOp = lines[li].text.match(/^\d+\s+#(\d+)\s+-/);
      if (!mOp) continue;
      const mcamNum = mOp[1];
      if (mcamToOkuma[mcamNum]) continue;
      for (const entry of toolLibrary) {
        if (matchesLibraryEntry(entry, lines[li].text)) {
          mcamToOkuma[mcamNum] = String(entry.okuma);
          pdfLog('map', '  #' + mcamNum + ' → T' + entry.okuma + '  (op list)');
          break;
        }
      }
    }

    if (!Object.keys(mcamToOkuma).length) pdfLog('warn', 'WARNING: No tools matched. Check library.');
    else pdfLog('info', 'Tool map: ' + Object.keys(mcamToOkuma).length + ' tools resolved.');

    const replacements = [];
    const addRep = (word, newText, extra={}) => {
      const dupe = replacements.some(r =>
        r.pageIndex === word.pageIndex &&
        Math.abs(r.x - word.x) < 2 &&
        Math.abs(r.y - word.y) < 2
      );
      if (!dupe) replacements.push({ ...word, oldText: word.text, newText, ...extra });
    };

    // ── Pass: Tool list header numbers  (#N standalone lines) ──
    for (const cur of lines) {
      const curTxt = cur.text.trim();
      if (!/^#\s*\d+\s*$/.test(curTxt)) continue;
      const mN = curTxt.match(/^#\s*(\d+)/);
      if (!mN || !mcamToOkuma[mN[1]]) continue;
      const hashWord = cur.words.find(w => w.text === '#');
      const numWord  = cur.words.find(w => /^\d+$/.test(w.text) && w.text === mN[1]);
      if (hashWord && numWord) {
        addRep(hashWord, '# '+mcamToOkuma[mN[1]], { isHeaderNum:true, w:(numWord.x+numWord.w)-hashWord.x });
      } else if (numWord) {
        addRep(numWord, mcamToOkuma[mN[1]], { isHeaderNum:true });
      }
    }

    // ── Pass: Operation rows — scan word-by-word for pattern: opNum #mcamNum - ──
    // This avoids line-merging issues entirely by working on the raw word stream.
    // Pattern: word[i]=opNumber(digits), word[i+1]='#'+mcamNum OR word[i+1]='#' & word[i+2]=mcamNum
    // All words sorted by page then y then x.
    const sortedWords = allWords.slice().sort((a,b) =>
      a.pageIndex !== b.pageIndex ? a.pageIndex - b.pageIndex :
      Math.abs(a.y - b.y) > 1    ? b.y - a.y :   // higher y = higher on page
      a.x - b.x
    );

    for (let wi = 0; wi < sortedWords.length - 2; wi++) {
      const w0 = sortedWords[wi];
      const w1 = sortedWords[wi + 1];
      const w2 = sortedWords[wi + 2];

      // Must be on same page, same approximate Y (within 3 units)
      if (w1.pageIndex !== w0.pageIndex) continue;
      if (Math.abs(w1.y - w0.y) > 3)    continue;

      // w0 must be an operation sequence number (1-3 digit standalone number)
      if (!/^\d{1,3}$/.test(w0.text)) continue;

      // Case A: w1 is '#N' combined token
      let mcamNum = null;
      let hashToken = null;
      if (/^#\d+$/.test(w1.text)) {
        mcamNum   = w1.text.slice(1);
        hashToken = w1;
      }
      // Case B: w1 is '#' and w2 is the number (split tokens), same Y
      else if (w1.text === '#' && w2 && w2.pageIndex === w0.pageIndex &&
               Math.abs(w2.y - w0.y) <= 3 && /^\d+$/.test(w2.text)) {
        // Check w3 is '-' to confirm op row pattern
        const w3 = sortedWords[wi + 3];
        if (w3 && w3.pageIndex === w0.pageIndex && Math.abs(w3.y - w0.y) <= 3 &&
            (w3.text === '-' || w3.text.startsWith('-'))) {
          mcamNum   = w2.text;
          hashToken = w2;
        }
      }

      if (!mcamNum || !mcamToOkuma[mcamNum]) continue;

      // Confirm it looks like an op row: next non-# word should be '-'
      const checkW = hashToken === w1 ? w2 : sortedWords[wi + 3];
      if (!checkW || checkW.pageIndex !== w0.pageIndex) continue;
      if (Math.abs(checkW.y - w0.y) > 3) continue;
      if (!checkW.text.startsWith('-') && checkW.text !== '-') continue;

      // Replace the #N or just N token
      addRep(hashToken, '#' + mcamToOkuma[mcamNum]);

      // Now find H: D: WO: tokens on this same row (within 3 y units, same page)
      const rowY  = w0.y;
      const rowPg = w0.pageIndex;
      const rowWords = sortedWords.filter(w =>
        w.pageIndex === rowPg && Math.abs(w.y - rowY) <= 3
      ).sort((a,b) => a.x - b.x);

      for (let ri = 0; ri < rowWords.length; ri++) {
        const rw = rowWords[ri];
        if (rw.text === 'H:' || rw.text === 'D:') {
          for (let rj = ri + 1; rj < rowWords.length; rj++) {
            const cand = rowWords[rj];
            if (cand.text === 'Z:' || cand.text === 'WO:') break;
            if (/^\d+$/.test(cand.text)) {
              if (mcamToOkuma[cand.text]) addRep(cand, mcamToOkuma[cand.text]);
              break;
            }
          }
        }
        if (rw.text === 'WO:' && woInc > 0) {
          for (let rj = ri + 1; rj < rowWords.length; rj++) {
            const cand = rowWords[rj];
            if (/^\d+$/.test(cand.text)) {
              addRep(cand, String(parseInt(cand.text) + woInc), { isWO: true });
              break;
            }
          }
        }
      }
    }

    pdfLog('info', 'Found ' + replacements.length + ' tokens to replace.');
    if (replacements.length === 0) {
      pdfLog('warn', 'No replacements found. Check library or PDF format.');
      btn.disabled = false; btn.innerHTML = '&#128196; CONVERT PDF'; return;
    }

    pdfLog('info', 'Applying replacements...');
    const libDoc   = await PDFDocument.load(pdfBytes.slice());
    const font     = await libDoc.embedFont(StandardFonts.HelveticaBold);
    const libPages = libDoc.getPages();
    let repCount   = 0;

    for (const rep of replacements) {
      const pg   = libPages[rep.pageIndex];
      const fs = (!rep.isHeaderNum && !rep.isWO && String(rep.newText).trim().length >= 4) ? Math.max((rep.fontSize || 8) - 1.5, 6) : Math.max(rep.fontSize || 8, 6);
      const isWO = rep.isWO === true;
      const oldW = font.widthOfTextAtSize(String(rep.oldText), fs);
      const newW = font.widthOfTextAtSize(String(rep.newText), fs);
      let stampX = rep.x;
      if (rep.isHeaderNum && newW > oldW)  stampX = rep.x + oldW - newW + 13;
      if (rep.isHeaderNum && newW <= oldW) stampX = rep.x + 4;
      if (isWO)                            stampX = rep.x - 1;
      if (!isWO && !rep.isHeaderNum)       stampX = rep.x - 3;

      const padL = isWO?4:rep.isHeaderNum?4:2, padR = isWO?2:1, padB = isWO?3:1, padT = isWO?1:rep.isHeaderNum?2:0;
      const whiteL = Math.min(rep.x,stampX)-padL;
      const whiteR = Math.max(rep.x+oldW,stampX+newW)+padR;
      pg.drawRectangle({ x:whiteL, y:rep.y-padB, width:whiteR-whiteL, height:(!rep.isHeaderNum&&!rep.isWO&&!String(rep.newText).startsWith('#')?(rep.h||fs)*0.9:(rep.h||fs))+padB+padT, color:rgb(1,1,1) });
      pg.drawText(String(rep.newText), { x:stampX, y:rep.y - (!rep.isHeaderNum && !rep.isWO && !String(rep.newText).startsWith('#') ? 2 : 0), size:fs, font, color:rgb(0,0,0) });
      repCount++;
    }

    pdfLog('ok', '══════════════════════════════════════════');
    pdfLog('ok', ' DONE — ' + repCount + ' replacements applied');
    pdfLog('ok', '══════════════════════════════════════════');

    document.getElementById('pdfStatPages').textContent    = numPages;
    document.getElementById('pdfStatTools').textContent    = Object.keys(mcamToOkuma).length;
    document.getElementById('pdfStatNums').textContent     = repCount;
    document.getElementById('pdfStatUnmapped').textContent = document.getElementById('pdfLogBox').querySelectorAll('.log-warn').length;
    document.getElementById('pdfStatsRow').style.display   = 'flex';

    const outBytes = await libDoc.save();
    const outName  = pdfFileName.replace(/\.[^.]+$/, '') + '_OKUMA.pdf';
    const url      = URL.createObjectURL(new Blob([outBytes], { type:'application/pdf' }));
    document.getElementById('pdfDownloadBtn').href          = url;
    document.getElementById('pdfDownloadBtn').download      = outName;
    document.getElementById('pdfDlMeta').textContent        = '  ·  ' + outName + '  ·  ' + repCount + ' numbers updated';
    document.getElementById('pdfDownloadBar').classList.add('show');

    pdfLog('info', 'Rendering preview...');
    const prevDoc = await pdfjsLib.getDocument({ data: outBytes }).promise;
    const wrap    = document.getElementById('pdfPreviewWrap');
    wrap.innerHTML = '';
    for (let pi = 0; pi < prevDoc.numPages; pi++) {
      const pg     = await prevDoc.getPage(pi+1);
      const vp     = pg.getViewport({ scale:1.4 });
      const canvas = document.createElement('canvas');
      canvas.className = 'pdf-page-canvas';
      canvas.width = vp.width; canvas.height = vp.height;
      wrap.appendChild(canvas);
      await pg.render({ canvasContext:canvas.getContext('2d'), viewport:vp }).promise;
    }
    document.getElementById('pdfPreviewPanel').style.display = 'block';
    document.getElementById('pdfEmptyState').style.display   = 'none';
    pdfLog('ok', 'Preview rendered. Ready to download.');

  } catch(err) {
    pdfLog('error', 'ERROR: ' + err.message);
    console.error(err);
  }
  btn.disabled = false; btn.innerHTML = '&#128196; CONVERT PDF';
}

// ════════════════════════════════════════
//  UTILITY
// ════════════════════════════════════════

function esc(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Init ──
loadLibrary();
renderAllTables();
