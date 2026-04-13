// ── Default tool library — 234 tools from OKUMA ALUMINUM.TOOLDB ──
// C.R tools (T73,T132,T146,T170,T180,T202) noted as corner rounders — type EM for now
const DEFAULT_FS_LIBRARY = [
  { type:'EM', name:'HELICAL - 82045 - ROUGHER - 3/4 DIA X 2.25 LOC X .03 RAD', tnum:'1', dia:0.75, fl:4, so:2.375, loc:2.25, rad:0.03, mat:'7075 Aluminum', id:1000 },
  { type:'EM', name:'HELICAL - 48655 - 3/4 DIA X 2.25 LOC', tnum:'2', dia:0.75, fl:4, so:2.375, loc:2.25, rad:0.0, mat:'7075 Aluminum', id:1001 },
  { type:'EM', name:'HELICAL - 48665 - 3/4 DIA X 2.25 LOC X .06 RAD', tnum:'3', dia:0.75, fl:4, so:2.375, loc:2.25, rad:0.06, mat:'7075 Aluminum', id:1002 },
  { type:'EM', name:'HELICAL - 82033 - ROUGHER -1/2 DIA X 2.0 LOC X .06 RADIUS', tnum:'4', dia:0.5, fl:4, so:2.125, loc:2.0, rad:0.06, mat:'7075 Aluminum', id:1003 },
  { type:'EM', name:'HELICAL - 48455 - 1/2 DIA X 2.00 LOC', tnum:'5', dia:0.5, fl:4, so:2.125, loc:2.0, rad:0.0, mat:'7075 Aluminum', id:1004 },
  { type:'EM', name:'HELICAL - 48325 - 3/8 DIA X 1.5 LOC X .06 RAD', tnum:'6', dia:0.375, fl:4, so:1.625, loc:1.5, rad:0.06, mat:'7075 Aluminum', id:1005 },
  { type:'EM', name:'HELICAL - 48310 - 3/8 DIA X 1.5 LOC', tnum:'7', dia:0.375, fl:4, so:1.625, loc:1.5, rad:0.0, mat:'7075 Aluminum', id:1006 },
  { type:'EM', name:'HELICAL - 48130 - 1/4 DIA X .75 LOC X .06 RAD', tnum:'8', dia:0.25, fl:3, so:0.75, loc:0.0, rad:0.06, mat:'7075 Aluminum', id:1007 },
  { type:'EM', name:'HELICAL - 48135 - 1/4 DIA X 1.0 LOC', tnum:'9', dia:0.25, fl:3, so:1.125, loc:1.0, rad:0.0, mat:'7075 Aluminum', id:1008 },
  { type:'EM', name:'HELICAL - 48395 - 1/2 DIA X 1.25 LOC', tnum:'10', dia:0.5, fl:4, so:1.375, loc:1.25, rad:0.0, mat:'7075 Aluminum', id:1009 },
  { type:'EM', name:'1/4 90 DEGREE CHAMFER MILL', tnum:'11', dia:0.25, fl:3, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1010 },
  { type:'DRILL', name:'1/4 SPOTDRILL', tnum:'12', dia:0.25, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1011 },
  { type:'DRILL', name:'NO. 40 STUB DRILL', tnum:'13', dia:0.098, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1012 },
  { type:'DRILL', name:'NO. 7 STUB DRILL', tnum:'14', dia:0.201, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1013 },
  { type:'DRILL', name:'LTR. F STUB DRILL', tnum:'15', dia:0.257, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1014 },
  { type:'CSINK', name:'1/2 100 DEGREE COUNTERSINK', tnum:'16', dia:0.5, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1015 },
  { type:'DRILL', name:'NO. 16 STUB DRILL', tnum:'17', dia:0.177, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1016 },
  { type:'TAP', name:'10-32 FORM TAP RH', tnum:'18', dia:0.19, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1017 },
  { type:'DRILL', name:'LTR. A STUB DRILL', tnum:'19', dia:0.234, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1018 },
  { type:'EM', name:'RA390-051R19-11M', tnum:'20', dia:1.9392, fl:4, so:0.75, loc:0.0, rad:0.0027, mat:'7075 Aluminum', id:1019 },
  { type:'TAP', name:'1/4-28 FORM TAP RH', tnum:'21', dia:0.25, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1020 },
  { type:'EM', name:'HELICAL - 48120 - 1/4 DIA X .750 LOC X.015 RAD', tnum:'22', dia:0.25, fl:3, so:0.75, loc:0.0, rad:0.015, mat:'7075 Aluminum', id:1021 },
  { type:'EM', name:'HELICAL - 49105 - 1/4 DIA X .750 LOC', tnum:'23', dia:0.25, fl:3, so:0.75, loc:0.0, rad:0.125, mat:'7075 Aluminum', id:1022 },
  { type:'EM', name:'HELICAL - 48020 - 1/8 DIA X .500 LOC', tnum:'24', dia:0.125, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1023 },
  { type:'EM', name:'HELICAL - 48125 - 1/4 DIA X .750 LOC X .030 RAD', tnum:'25', dia:0.25, fl:3, so:0.75, loc:0.0, rad:0.03, mat:'7075 Aluminum', id:1024 },
  { type:'EM', name:'HELICAL - 48275 - 3/8 DIA X 1.0 LOC X .06 RAD', tnum:'26', dia:0.375, fl:4, so:1.125, loc:1.0, rad:0.06, mat:'7075 Aluminum', id:1025 },
  { type:'EM', name:'#12 TM HARVEY - 987136-C3 - 10-32 Thread Mill', tnum:'27', dia:0.15, fl:3, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1026 },
  { type:'DRILL', name:'NO. 21 STUB DRILL', tnum:'28', dia:0.159, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1027 },
  { type:'EM', name:'HELICAL - 83681 - 1/2 DIA X 1.6250 LOC X .125 RAD', tnum:'29', dia:0.5, fl:4, so:1.75, loc:1.625, rad:0.125, mat:'7075 Aluminum', id:1028 },
  { type:'DRILL', name:'NO. 3 STUB DRILL', tnum:'30', dia:0.213, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1029 },
  { type:'DRILL', name:'LTR. G STUB DRILL', tnum:'31', dia:0.261, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1030 },
  { type:'DRILL', name:'7/32 STUB DRILL', tnum:'32', dia:0.2188, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1031 },
  { type:'EM', name:'3/8 90 DEGREE CHAMFER MILL', tnum:'33', dia:0.375, fl:4, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1032 },
  { type:'EM', name:'1/8 90 DEGREE CHAMFER MILL', tnum:'34', dia:0.125, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1033 },
  { type:'DRILL', name:'3/8 -SPOTDRILL', tnum:'35', dia:0.375, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1034 },
  { type:'DRILL', name:'LTR. O STUB DRILL', tnum:'36', dia:0.316, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1035 },
  { type:'EM', name:'HELICAL - 82021 - ROUGHER -1/2 DIA X 1.625 LOC X .03 RAD', tnum:'37', dia:0.5, fl:4, so:1.75, loc:1.625, rad:0.03, mat:'7075 Aluminum', id:1036 },
  { type:'EM', name:'HELICAL - 48425 - 1/2 DIA X 1.625 LOC', tnum:'38', dia:0.5, fl:4, so:1.75, loc:1.625, rad:0.0, mat:'7075 Aluminum', id:1037 },
  { type:'EM', name:'HELICAL - 48410 - 1/2 DIA X 1.25 LOC X 0.06 RAD', tnum:'39', dia:0.5, fl:4, so:1.375, loc:1.25, rad:0.06, mat:'7075 Aluminum', id:1038 },
  { type:'DRILL', name:'5/16 STUB DRILL', tnum:'40', dia:0.3125, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1039 },
  { type:'EM', name:'HELICAL - 82043 - ROUGHER - 3/4 DIA X 1.625 LOC X .03 RAD', tnum:'41', dia:0.75, fl:4, so:1.75, loc:1.625, rad:0.03, mat:'7075 Aluminum', id:1040 },
  { type:'EM', name:'HELICAL - 81417 - 3/4 DIA X 2.75 LOC', tnum:'42', dia:0.75, fl:4, so:2.875, loc:2.75, rad:0.0, mat:'7075 Aluminum', id:1041 },
  { type:'EM', name:'HELICAL - 48440 - 1/2 DIA X 1.625 LOC X .06 RAD', tnum:'43', dia:0.5, fl:4, so:1.75, loc:1.625, rad:0.06, mat:'7075 Aluminum', id:1042 },
  { type:'EM', name:'HELICAL - 49210 - 3/8 DIA X 1.0 LOC', tnum:'44', dia:0.375, fl:4, so:1.125, loc:1.0, rad:0.1875, mat:'7075 Aluminum', id:1043 },
  { type:'DRILL', name:'5/8 DEMMING DRILL', tnum:'45', dia:0.625, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1044 },
  { type:'DRILL', name:'7/32 JOBBER DRILL', tnum:'46', dia:0.2188, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1045 },
  { type:'EM', name:'HELICAL - 48260 - 3/8 DIA X 1.0 LOC', tnum:'47', dia:0.375, fl:4, so:1.125, loc:1.0, rad:0.0, mat:'7075 Aluminum', id:1046 },
  { type:'EM', name:'HELICAL - 81409 - 5/16 DIA X 1.00 LOC', tnum:'48', dia:0.3125, fl:4, so:1.125, loc:1.0, rad:0.0, mat:'7075 Aluminum', id:1047 },
  { type:'EM', name:'HELICAL - 48675 - 3/4 DIA X 2.25 LOC X .125 RAD', tnum:'49', dia:0.75, fl:4, so:2.375, loc:2.25, rad:0.125, mat:'7075 Aluminum', id:1048 },
  { type:'DRILL', name:'1/2 SPOTDRILL', tnum:'50', dia:0.5, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1049 },
  { type:'DRILL', name:'LTR. J JOBBER DRILL', tnum:'51', dia:0.277, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1050 },
  { type:'EM', name:'HELICAL - 48115 - 1/4 DIA X 3/4 LOC', tnum:'52', dia:0.25, fl:3, so:4.125, loc:4.0, rad:0.0, mat:'7075 Aluminum', id:1051 },
  { type:'DRILL', name:'NO. 22 STUB DRILL', tnum:'53', dia:0.157, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1052 },
  { type:'EM', name:'HELICAL - 81397 - 1/8 DIA X .750 LOC', tnum:'54', dia:0.125, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1053 },
  { type:'TAP', name:'8-32 FORM TAP RH', tnum:'55', dia:0.164, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1054 },
  { type:'CSINK', name:'3/8 100 DEGREE COUNTERSINK', tnum:'56', dia:0.375, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1055 },
  { type:'EM', name:'HELICAL - 49240 - 3/8 DIA X 1.5 LOC', tnum:'57', dia:0.375, fl:4, so:1.625, loc:1.5, rad:0.1875, mat:'7075 Aluminum', id:1056 },
  { type:'EM', name:'REDLINE - RET1233 - 3/32 DIA X .500 LOC', tnum:'58', dia:0.093, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1057 },
  { type:'EM', name:'HELICAL - 48655 - 3/4 DIA X 2.25 LOC', tnum:'59', dia:0.75, fl:4, so:2.375, loc:2.25, rad:0.0, mat:'7075 Aluminum', id:1058 },
  { type:'EM', name:'HELICAL - 48470 - 1/2 DIA X 2.0 LOC X .06 RAD', tnum:'60', dia:0.5, fl:4, so:2.125, loc:2.0, rad:0.06, mat:'7075 Aluminum', id:1059 },
  { type:'EM', name:'HELICAL - 48480 - 1/2 DIA X 2.0 LOC X .125 RAD', tnum:'61', dia:0.5, fl:4, so:2.125, loc:2.0, rad:0.125, mat:'7075 Aluminum', id:1060 },
  { type:'EM', name:'HELICAL - 48685 - 3/4 DIA X 2.25 LOC X .25 RAD', tnum:'62', dia:0.75, fl:4, so:2.375, loc:2.25, rad:0.25, mat:'7075 Aluminum', id:1061 },
  { type:'DRILL', name:'NO. 7 JOBBER DRILL', tnum:'63', dia:0.201, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1062 },
  { type:'DRILL', name:'LTR. H JOBBER DRILL', tnum:'64', dia:0.266, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1063 },
  { type:'DRILL', name:'1/8 STUB DRILL', tnum:'65', dia:0.125, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1064 },
  { type:'EM', name:'#10 TM SCC2 TMLR139-32ELA 10-32', tnum:'66', dia:0.139, fl:3, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1065 },
  { type:'EM', name:'HELICAL - 48420 - 1/2 DIA X 1.25 LOC X .125 RAD', tnum:'67', dia:0.5, fl:4, so:1.375, loc:1.25, rad:0.125, mat:'7075 Aluminum', id:1066 },
  { type:'EM', name:'1-20 Thread Mill - 0.125', tnum:'68', dia:0.67, fl:4, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1067 },
  { type:'DRILL', name:'.257 -REAMER', tnum:'69', dia:0.257, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1068 },
  { type:'CSINK', name:'5/8 - 100 DEGREE COUNTERSINK', tnum:'70', dia:0.625, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1069 },
  { type:'EM', name:'HELICAL - 48060 - 3/16 DIA X 1.0 LOC', tnum:'71', dia:0.1875, fl:3, so:1.125, loc:1.0, rad:0.0, mat:'7075 Aluminum', id:1070 },
  { type:'EM', name:'HELICAL - 49285 - 1/2 DIA X 1.25 LOC', tnum:'72', dia:0.5, fl:4, so:1.375, loc:1.25, rad:0.25, mat:'7075 Aluminum', id:1071 },
  { type:'EM', name:'1/8 - CORNER ROUND W/ .25 PILOT', tnum:'73', dia:0.255, fl:4, so:0.75, loc:0.0, rad:0.125, mat:'7075 Aluminum', id:1072 }, // C.R — corner rounder
  { type:'TAP', name:'1/4-28 CUT TAP RH', tnum:'74', dia:0.25, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1073 },
  { type:'EM', name:'HELICAL - 81401 - 1/4 DIA X 1.25 LOC', tnum:'75', dia:0.25, fl:3, so:1.375, loc:1.25, rad:0.0, mat:'7075 Aluminum', id:1074 },
  { type:'EM', name:'HELICAL - 82393 - 5/16 DIA X 1.25 LOC', tnum:'76', dia:0.3125, fl:4, so:1.375, loc:1.25, rad:0.0, mat:'7075 Aluminum', id:1075 },
  { type:'DRILL', name:'NO. 21 STUB DRILL', tnum:'77', dia:0.159, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1076 },
  { type:'TAP', name:'10-32 CUT TAP RH', tnum:'78', dia:0.19, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1077 },
  { type:'DRILL', name:'NO. 11 STUB DRILL', tnum:'79', dia:0.191, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1078 },
  { type:'DRILL', name:'NO. 6 STUB DRILL', tnum:'80', dia:0.204, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1079 },
  { type:'EM', name:'HELICAL - 48640 - 3/4 DIA X 1.625 LOC X .125 RAD', tnum:'81', dia:0.75, fl:4, so:1.75, loc:1.625, rad:0.125, mat:'7075 Aluminum', id:1080 },
  { type:'DRILL', name:'NO. 4 STUB DRILL', tnum:'82', dia:0.209, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1081 },
  { type:'DRILL', name:'NO. 16 JOBBER DRILL', tnum:'83', dia:0.177, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1082 },
  { type:'TAP', name:'10-32 FORM EXTENDED LENGTH TAP RH', tnum:'84', dia:0.19, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1083 },
  { type:'EM', name:'HELICAL - 49060 - 3/16 DIA X .750 LOC', tnum:'85', dia:0.1875, fl:3, so:0.75, loc:0.0, rad:0.0938, mat:'7075 Aluminum', id:1084 },
  { type:'EM', name:'HELICAL - 48620 - 3/4 DIA X 1.625 LOC', tnum:'86', dia:0.75, fl:4, so:1.75, loc:1.625, rad:0.0, mat:'7075 Aluminum', id:1085 },
  { type:'EM', name:'.265 Diameter Slot .046 Thick', tnum:'87', dia:0.265, fl:4, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1086 },
  { type:'DRILL', name:'3/16 JOBBER DRILL', tnum:'88', dia:0.1875, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1087 },
  { type:'EM', name:'HELICAL - 01105 - 3/16 DIA X 0.5625 LOC', tnum:'89', dia:0.1875, fl:3, so:0.6875, loc:0.5625, rad:0.0, mat:'7075 Aluminum', id:1088 },
  { type:'EM', name:'#18 TM RM20119 - 3/8-16 Thread Mill', tnum:'90', dia:0.29, fl:4, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1089 },
  { type:'DRILL', name:'1/4 STUB DRILL', tnum:'91', dia:0.25, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1090 },
  { type:'DRILL', name:'NO. 56 STUB DRILL', tnum:'92', dia:0.0456, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1091 },
  { type:'EM', name:'REDLINE - RE10904 -1/16 DIA X .25 LOC', tnum:'93', dia:0.062, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1092 },
  { type:'DRILL', name:'NO. 30 JOBBER DRILL', tnum:'94', dia:0.1285, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1093 },
  { type:'EM', name:'HELICAL - 48395 - 1/2 DIA X 1.25 LOC', tnum:'95', dia:0.5, fl:4, so:1.375, loc:1.25, rad:0.0, mat:'7075 Aluminum', id:1094 },
  { type:'TAP', name:'M6 X 1.0 FORM TAP RH', tnum:'96', dia:0.2362, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1095 },
  { type:'DRILL', name:'11/64 STUB DRILL', tnum:'97', dia:0.1719, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1096 },
  { type:'DRILL', name:'LTR. N STUB DRILL', tnum:'98', dia:0.302, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1097 },
  { type:'CSINK', name:'.395 GROUND 100° COUNTERSINK', tnum:'100', dia:0.395, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1098 },
  { type:'DRILL', name:'1/4 SPOTDRILL w/ Whitney 4" Extension Holder 3.0" Projection', tnum:'101', dia:0.25, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1099 },
  { type:'DRILL', name:'7/32 STUB DRILL w/ Whitney 4" Extension Holder 3.0" Projection', tnum:'102', dia:0.2188, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1100 },
  { type:'EM', name:'HELICAL - 19317 - 1/2 DIA X 5/8 LOC X 3.3750 REACH', tnum:'103', dia:0.5, fl:4, so:8.125, loc:8.0, rad:0.0, mat:'7075 Aluminum', id:1101 },
  { type:'CSINK', name:'1/2 100° COUNTERSINK w EXTENSION', tnum:'104', dia:0.5, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1102 },
  { type:'TAP', name:'NO. 6-32 FORM TAP RH', tnum:'105', dia:0.138, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1103 },
  { type:'DRILL', name:'NO. 25 JOBBER DRILL', tnum:'106', dia:0.1495, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1104 },
  { type:'EM', name:'GWO - 314744 - 3/8 DIA X 1.0 LOC X .045', tnum:'107', dia:0.375, fl:4, so:1.125, loc:1.0, rad:0.045, mat:'7075 Aluminum', id:1105 },
  { type:'DRILL', name:'1/8 SPOTDRILL', tnum:'108', dia:0.125, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1106 },
  { type:'CSINK', name:'1/2 90 DEGREE COUNTERSINK', tnum:'109', dia:0.5, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1107 },
  { type:'DRILL', name:'NO. 16 CARBIDE JOBBER DRILL', tnum:'110', dia:0.177, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1108 },
  { type:'DRILL', name:'NO. 16 CARBIDE STUB DRILL', tnum:'111', dia:0.177, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1109 },
  { type:'EM', name:'HELICAL - 59224 - 3/4 DIA X 3.250 LOC X .06 RAD', tnum:'112', dia:0.75, fl:4, so:3.375, loc:3.25, rad:0.06, mat:'7075 Aluminum', id:1110 },
  { type:'EM', name:'HELICAL - 48650 - 3/4 DIA X 1.625 LOC X .25 RAD', tnum:'113', dia:0.75, fl:4, so:1.75, loc:1.625, rad:0.25, mat:'7075 Aluminum', id:1111 },
  { type:'DRILL', name:'3/32 STUB DRILL', tnum:'114', dia:0.0938, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1112 },
  { type:'DRILL', name:'LTR. P STUB DRILL', tnum:'115', dia:0.323, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1113 },
  { type:'TAP', name:'M8. X 1.25 FORM BOTTOM TAP RH', tnum:'116', dia:0.315, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1114 },
  { type:'DRILL', name:'.251 Reamer', tnum:'117', dia:0.251, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1115 },
  { type:'DRILL', name:'NO. 25 STUB DRILL', tnum:'118', dia:0.1495, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1116 },
  { type:'EM', name:'1/4 INCH ENGRAVING TOOL 30 DEGREE X .015 TIP', tnum:'119', dia:0.25, fl:3, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1117 },
  { type:'EM', name:'HELICAL - 03705 - 3/4 DIA X 4.00 LOC', tnum:'120', dia:0.75, fl:4, so:4.125, loc:4.0, rad:0.0, mat:'7075 Aluminum', id:1118 },
  { type:'DRILL', name:'27/64 STUB DRILL', tnum:'121', dia:0.4219, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1119 },
  { type:'EM', name:'#6 TM 1/2-13 UNC CARBIDE Thread Mill', tnum:'122', dia:0.37, fl:4, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1120 },
  { type:'DRILL', name:'NO. 34 STUB DRILL', tnum:'123', dia:0.111, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1121 },
  { type:'DRILL', name:'.1245 Reamer', tnum:'124', dia:0.1245, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1122 },
  { type:'DRILL', name:'7/8 DEMING DRILL', tnum:'125', dia:0.875, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1123 },
  { type:'EM', name:'HELICAL - 81415 - 1/2 DIA X 2.5 LOC X', tnum:'126', dia:0.5, fl:4, so:2.625, loc:2.5, rad:0.0, mat:'7075 Aluminum', id:1124 },
  { type:'EM', name:'HELICAL - 48150 - 1/4 DIA X 1.0 LOC X .06 RAD', tnum:'127', dia:0.25, fl:3, so:1.125, loc:1.0, rad:0.06, mat:'7075 Aluminum', id:1125 },
  { type:'EM', name:'HELICAL - 49040 - 1/8 DIA X .500 LOC', tnum:'128', dia:0.125, fl:2, so:0.75, loc:0.0, rad:0.0625, mat:'7075 Aluminum', id:1126 },
  { type:'EM', name:'HELICAL-86968 - 1/8 DIA X 1.0 LOC', tnum:'129', dia:0.125, fl:2, so:1.125, loc:1.0, rad:0.0625, mat:'7075 Aluminum', id:1127 },
  { type:'EM', name:'#13 TM HARVEY - 987128-C3 - 8-32 Thread Mill', tnum:'131', dia:0.131, fl:3, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1128 },
  { type:'EM', name:'3/32- CORNER ROUND W/ .188 PILOT', tnum:'132', dia:0.188, fl:3, so:0.75, loc:0.0, rad:0.0938, mat:'7075 Aluminum', id:1129 }, // C.R — corner rounder
  { type:'DRILL', name:'31/64 JOBBER DRILL', tnum:'133', dia:0.4844, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1130 },
  { type:'DRILL', name:'.507 REAMER', tnum:'134', dia:0.507, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1131 },
  { type:'EM', name:'HELICAL-82395 - 3/8 DIA X 2.0 LOC', tnum:'135', dia:0.375, fl:4, so:2.125, loc:2.0, rad:0.0, mat:'7075 Aluminum', id:1132 },
  { type:'EM', name:'HELICAL - 48045 - 3/16 DIA X .75 LOC', tnum:'136', dia:0.1875, fl:3, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1133 },
  { type:'DRILL', name:'NO. 2 DRILL', tnum:'137', dia:0.221, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1134 },
  { type:'EM', name:'HELICAL - 49065 - 3/16 DIA X 1.0 LOC', tnum:'138', dia:0.1875, fl:3, so:1.125, loc:1.0, rad:0.0938, mat:'7075 Aluminum', id:1135 },
  { type:'EM', name:'HELICAL - 03690 - 3/4 DIA X 3.25 LOC', tnum:'139', dia:0.75, fl:4, so:3.375, loc:3.25, rad:0.0, mat:'7075 Aluminum', id:1136 },
  { type:'EM', name:'HELICAL - 59233 - 3/4 DIA X 3.25 LOC X .25 RAD', tnum:'140', dia:0.75, fl:4, so:3.375, loc:3.25, rad:0.25, mat:'7075 Aluminum', id:1137 },
  { type:'EM', name:'SGS-32778- 1/2 x .750 LOC X .125 RAD', tnum:'141', dia:0.5, fl:4, so:0.75, loc:0.0, rad:0.125, mat:'7075 Aluminum', id:1138 },
  { type:'DRILL', name:'3.1MM STUB DRILL', tnum:'142', dia:0.122, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1139 },
  { type:'DRILL', name:'8.0MM REAMER - .315 DIA', tnum:'143', dia:0.315, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1140 },
  { type:'EM', name:'HELICAL - 82047 - ROUGHER - 3/4 DIA X 3.25 LOC X .03 RAD', tnum:'144', dia:0.75, fl:4, so:3.375, loc:3.25, rad:0.03, mat:'7075 Aluminum', id:1141 },
  { type:'EM', name:'HELICAL - 81537 - 1/4 DIA X .375 LOC X 1.6250 REACH - BALL EM', tnum:'145', dia:0.25, fl:3, so:0.75, loc:0.0, rad:0.125, mat:'7075 Aluminum', id:1142 },
  { type:'EM', name:'1/32- CORNER ROUND W/ .255 PILOT', tnum:'146', dia:0.255, fl:4, so:0.75, loc:0.0, rad:0.0938, mat:'7075 Aluminum', id:1143 }, // C.R — corner rounder
  { type:'DRILL', name:'LTR. C STUB DRILL', tnum:'147', dia:0.242, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1144 },
  { type:'DRILL', name:'.252 Reamer', tnum:'148', dia:0.252, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1145 },
  { type:'DRILL', name:'NO. 9 STUB DRILL', tnum:'149', dia:0.196, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1146 },
  { type:'DRILL', name:'LTR. I STUB DRILL', tnum:'150', dia:0.272, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1147 },
  { type:'DRILL', name:'7/32 EXTRA LONG JOBBER DRILL', tnum:'151', dia:0.2188, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1148 },
  { type:'DRILL', name:'NO. 24 STUB DRILL', tnum:'152', dia:0.152, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1149 },
  { type:'DRILL', name:'13/64 STUB DRILL', tnum:'153', dia:0.2031, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1150 },
  { type:'EM', name:'.187 X 1.140 SLOT MILL', tnum:'154', dia:1.14, fl:4, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1151 },
  { type:'TAP', name:'3/8-16 CUT TAP RH', tnum:'155', dia:0.375, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1152 },
  { type:'EM', name:'#25 TM SCC2 - TMLR126-32EL- 8-32 EXTENDED THREAD MILL', tnum:'156', dia:0.126, fl:3, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1153 },
  { type:'DRILL', name:'NO. 39 STUB DRILL', tnum:'157', dia:0.0995, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1154 },
  { type:'EM', name:'#7 TM HARVEY - 987144-C3 - 1/4-20 Thread Mill', tnum:'158', dia:0.195, fl:3, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1155 },
  { type:'EM', name:'HELICAL - 48055 - 3/16 DIA X .750 LOC X .03 RAD', tnum:'159', dia:0.1875, fl:3, so:0.75, loc:0.0, rad:0.03, mat:'7075 Aluminum', id:1156 },
  { type:'CSINK', name:'1/4 100 DEGREE COUNTERSINK', tnum:'160', dia:0.25, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1157 },
  { type:'DRILL', name:'.5005 REAMER', tnum:'161', dia:0.5005, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1158 },
  { type:'DRILL', name:'39/64 DRILL', tnum:'162', dia:0.6094, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1159 },
  { type:'EM', name:'HARVEY - 831960 -3/16 DIA X .625 LOC X .06 RAD', tnum:'163', dia:0.1875, fl:3, so:0.75, loc:0.0, rad:0.06, mat:'7075 Aluminum', id:1160 },
  { type:'EM', name:'HELICAL - 48405 - 1/2 DIA X 1.250 LOC X .03 RAD', tnum:'164', dia:0.5, fl:4, so:1.375, loc:1.25, rad:0.03, mat:'7075 Aluminum', id:1161 },
  { type:'DRILL', name:'.250 Reamer', tnum:'165', dia:0.25, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1162 },
  { type:'DRILL', name:'.254 Reamer', tnum:'166', dia:0.254, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1163 },
  { type:'DRILL', name:'NO. 36 JOBBER DRILL', tnum:'167', dia:0.1065, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1164 },
  { type:'DRILL', name:'NO. 11 JOBBER DRILL', tnum:'168', dia:0.191, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1165 },
  { type:'DRILL', name:'NO. 10 STUB DRILL', tnum:'169', dia:0.194, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1166 },
  { type:'EM', name:'1/4 C.R W/.375 PILOT', tnum:'170', dia:0.375, fl:4, so:0.75, loc:0.0, rad:0.25, mat:'7075 Aluminum', id:1167 }, // C.R — corner rounder
  { type:'EM', name:'.375 45° Dovetail Cutter', tnum:'171', dia:0.375, fl:4, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1168 },
  { type:'DRILL', name:'V STUB DRILL', tnum:'172', dia:0.377, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1169 },
  { type:'TAP', name:'10-24 CUT TAP RH', tnum:'173', dia:0.19, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1170 },
  { type:'DRILL', name:'LTR. H STUB DRILL', tnum:'174', dia:0.266, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1171 },
  { type:'DRILL', name:'3/8 90 Degree Long Reach Spot Drill', tnum:'175', dia:0.375, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1172 },
  { type:'TAP', name:'1/4-20 FORM TAPRH', tnum:'176', dia:0.25, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1173 },
  { type:'DRILL', name:'NO. 1 STUB DRILL', tnum:'177', dia:0.228, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1174 },
  { type:'EM', name:'HELICAL - 48030 - 3/16 DIA X .375 LOC', tnum:'178', dia:0.1875, fl:3, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1175 },
  { type:'CSINK', name:'3/4 100 DEGEREE COUNTERSINK', tnum:'179', dia:0.75, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1176 },
  { type:'EM', name:'1/16" C.R W/.125 PILOT', tnum:'180', dia:0.13, fl:3, so:0.75, loc:0.0, rad:0.062, mat:'7075 Aluminum', id:1177 }, // C.R — corner rounder
  { type:'DRILL', name:'NO.17 STUB DRILL', tnum:'181', dia:0.173, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1178 },
  { type:'EM', name:'406 SLOT MILL', tnum:'182', dia:0.765, fl:4, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1179 },
  { type:'DRILL', name:'1/2 STUB DRILL', tnum:'183', dia:0.5, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1180 },
  { type:'DRILL', name:'LTR. T STUB DRILL', tnum:'184', dia:0.358, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1181 },
  { type:'EM', name:'HELICAL - 48060 - 5/32 DIA X 1.0 LOC', tnum:'185', dia:0.1563, fl:3, so:1.125, loc:1.0, rad:0.0, mat:'7075 Aluminum', id:1182 },
  { type:'DRILL', name:'LTR. Q STUB DRILL', tnum:'186', dia:0.332, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1183 },
  { type:'DRILL', name:'7/32 STUB DRILL', tnum:'187', dia:0.219, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1184 },
  { type:'DRILL', name:'3/4 90° SPOTDRILL', tnum:'188', dia:0.75, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1185 },
  { type:'TAP', name:'#17 TM REDLINE - RM20202 - 1/8-27 NPT', tnum:'189', dia:0.31, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1186 },
  { type:'DRILL', name:'7/16 JOBBER DRILL', tnum:'190', dia:0.4375, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1187 },
  { type:'TAP', name:'#19 TM REDLINE - RM20205 - 1/4-18 NPT', tnum:'191', dia:0.37, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1188 },
  { type:'DRILL', name:'NO. 27 STUB DRILL', tnum:'192', dia:0.144, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1189 },
  { type:'DRILL', name:'11.00mm Stub Drill', tnum:'193', dia:0.433, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1190 },
  { type:'TAP', name:'M4 X .70 FORM TAP RH', tnum:'194', dia:0.1575, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1191 },
  { type:'EM', name:'HELICAL-59218 - 35 DEG HELIX CORNER RADIUS END MILL FOR ALUMINUM - 0.7500 (3/4) DIA X 0.7500 (3/4) SHANK DIA X 0.1900 R', tnum:'195', dia:0.75, fl:4, so:0.75, loc:0.0, rad:0.19, mat:'7075 Aluminum', id:1192 },
  { type:'DRILL', name:'NO. 12 JOBBER DRILL', tnum:'196', dia:0.189, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1193 },
  { type:'DRILL', name:'1/4 SPOTDRILL Extra Long', tnum:'197', dia:0.25, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1194 },
  { type:'EM', name:'HELICAL - 82431- 3/8 DIA X 2.0 LOC x .06', tnum:'198', dia:0.375, fl:4, so:2.125, loc:2.0, rad:0.06, mat:'7075 Aluminum', id:1195 },
  { type:'EM', name:'HELICAL - 81509 - 3/8 DIA X .5 LOC X .06 RAD X 2.50 REACH', tnum:'199', dia:0.375, fl:4, so:5.125, loc:5.0, rad:0.06, mat:'7075 Aluminum', id:1196 },
  { type:'CSINK', name:'3/8 100 DEGREE COUNTERSINK IN EXTENSION WITH 1.5 PROJECTION', tnum:'200', dia:0.375, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1197 },
  { type:'EM', name:'1/2 90 DEG CHAMFER MILL', tnum:'201', dia:0.5, fl:4, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1198 },
  { type:'EM', name:'1/32 - CORNER ROUND W/ .265 PILOT', tnum:'202', dia:0.265, fl:4, so:0.75, loc:0.0, rad:0.031, mat:'7075 Aluminum', id:1199 }, // C.R — corner rounder
  { type:'EM', name:'4" X .125 SLITTING SAW', tnum:'203', dia:4.0, fl:4, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1200 },
  { type:'DRILL', name:'LTR. U STUB DRILL', tnum:'204', dia:0.368, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1201 },
  { type:'DRILL', name:'.317 REAMER', tnum:'205', dia:0.317, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1202 },
  { type:'DRILL', name:'.381 REAMER', tnum:'206', dia:0.381, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1203 },
  { type:'DRILL', name:'.258 -REAMER', tnum:'207', dia:0.258, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1204 },
  { type:'DRILL', name:'5.7MM DRILL', tnum:'208', dia:0.2244, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1205 },
  { type:'DRILL', name:'NO. 5 STUB DRILL', tnum:'209', dia:0.2055, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1206 },
  { type:'DRILL', name:'4.40mm Stub Drill', tnum:'210', dia:0.1732, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1207 },
  { type:'EM', name:'#4 TM 1-12 TPI 1" Single Point Thread Mill', tnum:'211', dia:1.0, fl:4, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1208 },
  { type:'DRILL', name:'29/64 JOBBER DRILL', tnum:'212', dia:0.4531, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1209 },
  { type:'TAP', name:'1/2-20 CUT TAP RH', tnum:'213', dia:0.5, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1210 },
  { type:'DRILL', name:'37/64 DEMING DRILL', tnum:'214', dia:0.5781, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1211 },
  { type:'TAP', name:'5/8-18 CUT TAPRH', tnum:'215', dia:0.625, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1212 },
  { type:'DRILL', name:'13/64 JOBBER DRILL', tnum:'216', dia:0.2031, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1213 },
  { type:'DRILL', name:'LTR. F JOBBER DRILL', tnum:'217', dia:0.257, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1214 },
  { type:'EM', name:'#21 HAT2 836754-C6 - 5/16-18, UN, 3FL', tnum:'218', dia:0.235, fl:3, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1215 },
  { type:'EM', name:'#5 TM 5/8-11 UNC CARBIDE THREAD MILL', tnum:'219', dia:0.47, fl:4, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1216 },
  { type:'DRILL', name:'LTR. K STUB DRILL', tnum:'220', dia:0.281, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1217 },
  { type:'EM', name:'HELICAL - 82439 - 1/2 DIA X 2.5 LOC x .06 RADIUS', tnum:'221', dia:0.5, fl:4, so:2.625, loc:2.5, rad:0.06, mat:'7075 Aluminum', id:1218 },
  { type:'EM', name:'HELICAL - 82397 - 1/2 DIA X 3.125 LOC', tnum:'222', dia:0.5, fl:4, so:3.25, loc:3.125, rad:0.0, mat:'7075 Aluminum', id:1219 },
  { type:'EM', name:'REDLINE - RE12325 - 3/8 DIA X 1.5 LOC WITH LONG REACH', tnum:'223', dia:0.375, fl:4, so:1.625, loc:1.5, rad:0.0, mat:'7075 Aluminum', id:1220 },
  { type:'DRILL', name:'NO. 29 DRILL', tnum:'224', dia:0.136, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1221 },
  { type:'TAP', name:'8-32 CUT TAP RH', tnum:'225', dia:0.164, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1222 },
  { type:'TAP', name:'1/2-14 NPT TAPRH', tnum:'226', dia:0.5, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1223 },
  { type:'EM', name:'HELICAL - 81499 - 1/4 DIA X .375 LOC X .06 RAD X 2.125 REACH', tnum:'227', dia:0.25, fl:3, so:0.75, loc:0.0, rad:0.06, mat:'7075 Aluminum', id:1224 },
  { type:'EM', name:'#2 TM 11-32 TPI 1/2" Single Point Thread Mill', tnum:'228', dia:0.5, fl:4, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1225 },
  { type:'EM', name:'REDLINE - RE10106 - 3/32 DIA x .1875 LOC', tnum:'229', dia:0.0938, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1226 },
  { type:'EM', name:'HARVEY - 74362 -1/16 DIA X .186 LOC', tnum:'230', dia:0.062, fl:2, so:0.75, loc:0.0, rad:0.031, mat:'7075 Aluminum', id:1227 },
  { type:'TAP', name:'NO. 4-40 FORM TAP RH', tnum:'231', dia:0.112, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1228 },
  { type:'EM', name:'HELICAL - 81459 - 1/4 DIA X 1.25 LOC', tnum:'232', dia:0.25, fl:3, so:1.375, loc:1.25, rad:0.125, mat:'7075 Aluminum', id:1229 },
  { type:'EM', name:'HAT977645 1/4 Sharp Point Chamfer', tnum:'233', dia:0.25, fl:3, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1230 },
  { type:'CSINK', name:'7/16 100 DEG C.S', tnum:'234', dia:0.4375, fl:2, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1231 },
  { type:'EM', name:'#305 -SLOT MILL', tnum:'235', dia:0.625, fl:4, so:0.75, loc:0.0, rad:0.0, mat:'7075 Aluminum', id:1232 },
  { type:'EM', name:'HELICAL - 48630 - 3/4 X 1.625 LOC X .06', tnum:'236', dia:0.75, fl:4, so:1.75, loc:1.625, rad:0.06, mat:'7075 Aluminum', id:1233 },
];
// ============================================================
//  app.js — Feed & Speed Calculator UI Logic
//  Handles: tab switching, result display mirroring,
//           tool library (localStorage), quick-select,
//           field population from selected tool
// ============================================================

// ══════════════════════════════════════════
//  TAB SWITCHING
// ══════════════════════════════════════════
function openAppTab(name, btn) {
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  btn.classList.add('active');
  if (name === 'library') renderFSLibrary();
}

// ══════════════════════════════════════════
//  RESULT MIRRORING
//  script.js writes to hidden legacy <p> tags.
//  We use MutationObserver to mirror those
//  values into the new styled result boxes.
// ══════════════════════════════════════════
function mirrorText(sourceId, destId, transform) {
  const src  = document.getElementById(sourceId);
  const dest = document.getElementById(destId);
  if (!src || !dest) return;

  function update() {
    const raw = src.innerText || src.textContent || '';
    dest.textContent = transform ? transform(raw) : raw;
    // Show/hide dim state
    if (dest.classList.contains('result-val')) {
      dest.classList.toggle('dim', !raw || raw === '—');
    }
  }

  const obs = new MutationObserver(update);
  obs.observe(src, { childList: true, subtree: true, characterData: true });
}

// Extract numeric value after "Label: " prefix
function extractNum(label) {
  return raw => {
    const val = raw.replace(label, '').trim().split(' ')[0].split('|')[0].trim();
    return val || '—';
  };
}

// Set up all mirrors once DOM is ready
function setupMirrors() {
  // Endmill
  mirrorText('rpm',      'rpm-val',  extractNum('RPM:'));
  mirrorText('feedRate', 'feed-val', extractNum('Feed Rate (IPM):'));
  mirrorText('sfmOut',   'sfm-val',  extractNum('SFM:'));
  mirrorText('iptOut',   'ipt-val',  extractNum('Feed per Tooth (IPT):'));

  // Mirror warnings
  const warnSrc  = document.getElementById('warnings');
  const warnDest = document.getElementById('em-warn-box');
  if (warnSrc && warnDest) {
    new MutationObserver(() => {
      const txt = warnSrc.innerText || '';
      warnDest.textContent = txt;
      warnDest.classList.toggle('show', txt.trim().length > 0);
      warnDest.style.color = txt.includes('⚠️') ? 'var(--yellow)' : 'var(--accent)';
    }).observe(warnSrc, { childList: true, subtree: true, characterData: true });
  }

  // Drill
  mirrorText('rpmDrill',  'drill-rpm-val',  extractNum('RPM:'));
  mirrorText('feedDrill', 'drill-feed-val', extractNum('Feed Rate (IPM):'));

  const peckSrc  = document.getElementById('peckOut');
  const peckDest = document.getElementById('drill-peck-val');
  if (peckSrc && peckDest) {
    new MutationObserver(() => {
      const txt = peckSrc.innerText || '';
      peckDest.textContent = txt;
      peckDest.classList.toggle('show', txt.trim().length > 0);
    }).observe(peckSrc, { childList: true, subtree: true, characterData: true });
  }

  const drWarnSrc  = document.getElementById('drillWarn');
  const drWarnDest = document.getElementById('drill-warn-box');
  if (drWarnSrc && drWarnDest) {
    new MutationObserver(() => {
      const txt = drWarnSrc.innerText || '';
      drWarnDest.textContent = txt;
      drWarnDest.classList.toggle('show', txt.trim().length > 0);
    }).observe(drWarnSrc, { childList: true, subtree: true, characterData: true });
  }

  // Tapping
  mirrorText('rpmThread',  'tap-rpm-val',  extractNum('RPM:'));
  mirrorText('feedThread', 'tap-feed-val', raw => {
    // "Feed Rate (IPM): 12.345 | Pitch: 0.04167 in/rev" → just the IPM number
    const part = raw.replace('Feed Rate (IPM):', '').trim().split('|')[0].trim();
    return part || '—';
  });

  const tapPeckSrc  = document.getElementById('threadPeck');
  const tapPeckDest = document.getElementById('tap-peck-val');
  if (tapPeckSrc && tapPeckDest) {
    new MutationObserver(() => {
      const txt = tapPeckSrc.innerText || '';
      tapPeckDest.textContent = txt;
      tapPeckDest.classList.toggle('show', txt.trim().length > 0);
    }).observe(tapPeckSrc, { childList: true, subtree: true, characterData: true });
  }
}

// ══════════════════════════════════════════
//  TOOL LIBRARY (localStorage)
//  Separate from the Okuma converter library.
//  Stores: { type, name, tnum, dia, fl, so, loc, rad, mat }
// ══════════════════════════════════════════
let fsLib       = [];
let fsSortKey   = 'tnum';
let fsSortDir   = 1;
let fsUsage     = {}; // { id: { count, lastUsed } }

function loadFSUsage() {
  try { fsUsage = JSON.parse(localStorage.getItem('fsToolUsage_v1') || '{}'); } catch(e) { fsUsage = {}; }
}
function saveUsage(id) {
  const u = fsUsage[id] || { count: 0, lastUsed: 0 };
  fsUsage[id] = { count: u.count + 1, lastUsed: Date.now() };
  try { localStorage.setItem('fsToolUsage_v1', JSON.stringify(fsUsage)); } catch(e) {}
}
function usageScore(id) {
  const u = fsUsage[id];
  if (!u) return 0;
  const recency = Math.max(0, 1 - (Date.now() - u.lastUsed) / (7 * 24 * 3600 * 1000)); // decays over 7 days
  return u.count * 2 + recency * 5;
}



function loadFSLib() {
  try {
    const s   = localStorage.getItem('fsToolLibrary_v1');
    const ver = localStorage.getItem('fsLibVersion');
    if (s && ver === '3') {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed) && parsed.length > 10) {
        fsLib = parsed;
        return;
      }
    }
  } catch(e) {}
  // Seed from built-in library (also runs when version stamp is missing/old)
  fsLib = DEFAULT_FS_LIBRARY.map(t => Object.assign({}, t));
  saveFSLib();
}

function saveFSLib() {
  try {
    localStorage.setItem('fsToolLibrary_v1', JSON.stringify(fsLib));
    localStorage.setItem('fsLibVersion', '3');
  } catch(e) {}
}

// ── Add tool ──
function addFSTool() {
  const type = document.querySelector('input[name="addType"]:checked')?.value || 'EM';
  const name = document.getElementById('add-name').value.trim();
  const tnum = document.getElementById('add-tnum').value.trim();
  const dia  = parseFloat(document.getElementById('add-dia').value)     || 0;
  const fl   = parseInt(document.getElementById('add-flutes').value)    || 0;
  const so   = parseFloat(document.getElementById('add-stickout').value) || 0;
  const loc  = parseFloat(document.getElementById('add-loc').value)     || 0;
  const rad  = parseFloat(document.getElementById('add-rad').value)     || 0;
  const mat  = document.getElementById('add-mat').value;

  if (!name) { alert('Tool name is required.'); return; }

  fsLib.push({ type, name, tnum, dia, fl, so, loc, rad, mat,
    id: Date.now() + Math.random() });
  saveFSLib();
  renderFSLibrary();
  renderQuickCards();

  // Clear inputs
  ['add-name','add-tnum','add-dia','add-flutes','add-stickout','add-loc','add-rad']
    .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  const matEl = document.getElementById('add-mat');
  if (matEl) matEl.value = '';
}

// ── Remove tool ──
function removeFSTool(id) {
  fsLib = fsLib.filter(t => t.id !== id);
  saveFSLib();
  renderFSLibrary();
  renderQuickCards();
}

// ── Select tool → populate calc fields ──
function selectFSTool(id, tabHint) {
  const t = fsLib.find(x => x.id === id);
  if (!t) return;
  saveUsage(id);

  // Mark all cards selected/deselected
  document.querySelectorAll('.tool-card[data-fsid]').forEach(c => {
    c.classList.toggle('selected', c.dataset.fsid === String(id));
  });

  // Determine destination tab
  const isEndmill = t.type === 'EM';
  const isDrill   = t.type === 'DRILL' || t.type === 'CSINK';
  const isTap     = t.type === 'TAP';

  let destTab = tabHint;
  if (!destTab) {
    if (isEndmill) destTab = 'endmill';
    else if (isDrill) destTab = 'drill';
    else if (isTap) destTab = 'tapping';
  }

  // If called from library tab, navigate to the right calc tab
  const activePane = document.querySelector('.tab-pane.active');
  if (activePane && activePane.id === 'tab-library') {
    const tabBtn = document.querySelector(`.tab-btn[onclick*="'${destTab}'"]`);
    if (tabBtn) openAppTab(destTab, tabBtn);
  }

  if (destTab === 'endmill' || isEndmill) {
    updateEndmillBanner(t);
    populateEndmillFields(t);
  } else if (destTab === 'drill' || isDrill) {
    updateDrillBanner(t);
    populateDrillFields(t);
  }
  // TAP: just navigate to tapping tab — no field auto-fill yet since it uses thread dropdowns
}

function updateEndmillBanner(t) {
  const banner = document.getElementById('em-sel-banner');
  const name   = document.getElementById('em-sel-name');
  const props  = document.getElementById('em-sel-props');
  if (!banner) return;
  name.textContent = (t.tnum ? 'T' + t.tnum + ' — ' : '') + t.name;
  props.textContent = [
    t.dia  ? 'ø' + t.dia.toFixed(3) + '"' : null,
    t.fl   ? t.fl + 'FL' : null,
    t.so   ? t.so.toFixed(3) + '" SO' : null,
    t.loc  ? t.loc.toFixed(3) + '" LOC' : null,
  ].filter(Boolean).join('  ·  ');
  banner.classList.add('show');
}

function updateDrillBanner(t) {
  const banner = document.getElementById('dr-sel-banner');
  const name   = document.getElementById('dr-sel-name');
  const props  = document.getElementById('dr-sel-props');
  if (!banner) return;
  name.textContent = (t.tnum ? 'T' + t.tnum + ' — ' : '') + t.name;
  props.textContent = [
    t.dia  ? 'ø' + t.dia.toFixed(3) + '"' : null,
    t.so   ? t.so.toFixed(3) + '" SO' : null,
  ].filter(Boolean).join('  ·  ');
  banner.classList.add('show');
}

function getEMSubtype(t) {
  if (parseInt(t.tnum) === 20) return 'Shell Mill';
  const n = (t.name || '').toUpperCase();
  if (n.includes('BALL')) return 'Ball Nose';
  if (t.rad > 0 && t.rad < t.dia / 2) return 'Bull Nose';
  if (t.rad >= t.dia / 2 && t.rad > 0) return 'Ball Nose';
  return 'Flat Endmill';
}

function populateEndmillFields(t) {
  // Set tool type radio first so corner radius logic fires correctly
  const subtype = getEMSubtype(t);
  const radios  = document.querySelectorAll('input[name="toolType"]');
  radios.forEach(r => { r.checked = (r.value === subtype); });
  const checked = document.querySelector('input[name="toolType"]:checked');
  if (checked) checked.dispatchEvent(new Event('change', { bubbles: true }));

  // Small delay so shell mill UI toggle can fire before we overwrite dia/flutes
  requestAnimationFrame(() => {
    setFieldFlash('dia',          t.dia  ? t.dia.toFixed(3)  : '');
    setFieldFlash('flutes',       t.fl   ? String(t.fl)       : '');
    setFieldFlash('stickout',     t.so   ? t.so.toFixed(3)   : '');
    setFieldFlash('cornerRadius', t.rad  ? t.rad.toFixed(4)  : '0.000');
    if (t.mat) setSelectVal('material', t.mat);
    if (typeof updateCornerRadiusState === 'function') {
      updateCornerRadiusState('tool select');
    }
  });
}

function getDrillSubtype(t) {
  const n = (t.name || '').toUpperCase();
  if (t.type === 'CSINK' || n.includes('COUNTERSINK') || n.includes('C.S') || n.includes('CSINK')) return 'Countersink';
  if (n.includes('REAMER')) return 'Reamer';
  if (n.includes('SPOT') || n.includes('CENTER DRILL')) return 'Spotter';
  return 'Drill';
}

function populateDrillFields(t) {
  // Set drill type dropdown
  const subtype = getDrillSubtype(t);
  setSelectVal('drillType', subtype);

  setFieldFlash('diaDrill',     t.dia ? t.dia.toFixed(3) : '');
  setFieldFlash('flutesDrill',  t.fl  ? String(t.fl)     : '');
  setFieldFlash('stickoutDrill',t.so  ? t.so.toFixed(3)  : '');
  if (t.mat) setSelectVal('drillMaterial', t.mat);
}

function setFieldFlash(id, val) {
  const el = document.getElementById(id);
  if (!el || val === '') return;
  el.value = val;
  el.style.borderColor = 'var(--accent)';
  el.style.background  = 'rgba(0,230,118,0.06)';
  setTimeout(() => {
    el.style.borderColor = '';
    el.style.background  = '';
  }, 700);
}

function setSelectVal(id, val) {
  const el = document.getElementById(id);
  if (!el) return;
  for (const opt of el.options) {
    if (opt.value === val || opt.text === val) { el.value = opt.value; break; }
  }
}

// ── Clear selected tool ──
function clearSelectedTool(tab) {
  if (tab === 'endmill') {
    document.getElementById('em-sel-banner')?.classList.remove('show');
  } else if (tab === 'drill') {
    document.getElementById('dr-sel-banner')?.classList.remove('show');
  }
  document.querySelectorAll('.tool-card[data-fsid]')
    .forEach(c => c.classList.remove('selected'));
}

// ── Sort ──
function setFSSort(key, btn) {
  if (fsSortKey === key) fsSortDir *= -1;
  else { fsSortKey = key; fsSortDir = 1; }
  document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderFSLibrary();
}

// ── Render library ──
function renderFSLibrary() {
  const container = document.getElementById('lib-tool-cards');
  const cntEl     = document.getElementById('lib-count');
  if (!container) return;

  const q = (document.getElementById('lib-search')?.value || '').toLowerCase();

  let rows = fsLib.filter(t =>
    t.name.toLowerCase().includes(q) ||
    String(t.tnum).toLowerCase().includes(q) ||
    t.type.toLowerCase().includes(q) ||
    String(t.dia).includes(q)
  );

  rows.sort((a, b) => {
    let av, bv;
    if      (fsSortKey === 'tnum') { av = parseInt(a.tnum)||0; bv = parseInt(b.tnum)||0; }
    else if (fsSortKey === 'name') { av = a.name.toLowerCase(); bv = b.name.toLowerCase(); }
    else if (fsSortKey === 'dia')  { av = a.dia; bv = b.dia; }
    else if (fsSortKey === 'type') { av = a.type; bv = b.type; }
    if (av < bv) return -fsSortDir;
    if (av > bv) return fsSortDir;
    return 0;
  });

  if (cntEl) cntEl.textContent = fsLib.length + ' TOOLS';

  if (rows.length === 0) {
    container.innerHTML = `<div style="text-align:center;padding:40px;color:var(--dim);font-family:var(--mono);font-size:11px;line-height:1.9;">
      ${fsLib.length === 0
        ? 'No tools yet.<br>Use the form to add your first tool.'
        : 'No tools match your search.'}
    </div>`;
    return;
  }

  const badgeMap = { EM:'badge-em', DRILL:'badge-drill', TAP:'badge-tap', CSINK:'badge-csink' };

  container.innerHTML = rows.map(t => {
    const meta = [
      t.dia  ? 'ø' + t.dia.toFixed(3) : null,
      t.fl   ? t.fl + 'FL' : null,
      t.so   ? t.so.toFixed(3) + ' SO' : null,
      t.loc  ? t.loc.toFixed(3) + ' LOC' : null,
      t.rad  > 0 ? t.rad.toFixed(3) + ' RAD' : null,
    ].filter(Boolean).join(' · ');

    return `<div class="tool-card" data-fsid="${t.id}" onclick="selectFSTool(${t.id})">
      <div class="tc-num">T${escH(String(t.tnum||'—'))}</div>
      <div class="tc-info">
        <div class="tc-name">${escH(t.name)}</div>
        <div class="tc-meta">${escH(meta)}</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0;">
        <div class="tc-badge ${badgeMap[t.type]||'badge-csink'}">${escH(t.type)}</div>
        <button class="tc-delete" onclick="event.stopPropagation();removeFSTool(${t.id})">✕</button>
      </div>
    </div>`;
  }).join('');
}

// ── Quick-pick cards in calc tabs ──
function renderQuickCards() {
  renderQuickList('em-quick-cards', t => t.type === 'EM',
    'endmill', 'No endmill tools in library yet.', 'em-quick-search');
  renderQuickList('dr-quick-cards', t => t.type === 'DRILL' || t.type === 'CSINK',
    'drill',   'No drill tools in library yet.', 'dr-quick-search');
  renderQuickList('tap-quick-cards', t => t.type === 'TAP',
    'tapping', 'No tap tools in library yet.', 'tap-quick-search');
}

function renderQuickList(containerId, filterFn, tabHint, emptyMsg, searchId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const q     = searchId ? (document.getElementById(searchId)?.value || '').toLowerCase() : '';
  const tools = fsLib.filter(filterFn).filter(t =>
    !q || t.name.toLowerCase().includes(q) || String(t.tnum).includes(q)
  );

  if (tools.length === 0 && !q) {
    container.innerHTML = `<div class="empty-quick">${emptyMsg}</div>`;
    return;
  }
  if (tools.length === 0) {
    container.innerHTML = `<div class="empty-quick">No matches</div>`;
    return;
  }

  const badgeMap = { EM:'badge-em', DRILL:'badge-drill', TAP:'badge-tap', CSINK:'badge-csink' };

  // Sort: recently/frequently used first, then by T#
  const sorted = tools.slice().sort((a, b) => {
    const sa = usageScore(a.id), sb = usageScore(b.id);
    if (sa !== sb) return sb - sa;
    return (parseInt(a.tnum)||0) - (parseInt(b.tnum)||0);
  });

  container.innerHTML = sorted.map(t => {
    const score = usageScore(t.id);
    const meta  = [
      t.dia ? 'ø' + t.dia.toFixed(3) : null,
      t.fl  ? t.fl + 'FL' : null,
      t.so  ? t.so.toFixed(3) + ' SO' : null,
    ].filter(Boolean).join(' · ');

    const recentBadge = score > 0
      ? `<div style="font-size:8px;color:var(--accent);font-family:var(--mono);">★</div>` : '';

    return `<div class="tool-card" data-fsid="${t.id}"
        onclick="selectFSTool(${t.id}, '${tabHint}')">
      <div class="tc-num" style="font-size:14px;min-width:36px;">T${escH(String(t.tnum||'?'))}</div>
      <div class="tc-info">
        <div class="tc-name" style="font-size:12px;">${escH(t.name)}</div>
        <div class="tc-meta">${escH(meta)}</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0;">
        ${recentBadge}
        <div class="tc-badge ${badgeMap[t.type]||'badge-csink'}" style="font-size:8px;">${escH(t.type)}</div>
      </div>
    </div>`;
  }).join('');
}

// ── Export / Import ──
function exportFSLib() {
  const blob = new Blob([JSON.stringify(fsLib, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'fs_tool_library.json';
  a.click();
}

function importFSLib(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const data = JSON.parse(ev.target.result);
      if (!Array.isArray(data)) throw new Error('Expected JSON array');
      // Ensure all items have an id
      fsLib = data.map(t => ({ ...t, id: t.id || Date.now() + Math.random() }));
      saveFSLib();
      renderFSLibrary();
      renderQuickCards();
    } catch(err) { alert('Import failed: ' + err.message); }
  };
  reader.readAsText(file);
  e.target.value = '';
}

// ── Search listener ──
document.addEventListener('input', e => {
  if (e.target.id === 'lib-search')       renderFSLibrary();
  if (e.target.id === 'em-quick-search')  renderQuickList('em-quick-cards', t => t.type === 'EM', 'endmill', 'No endmill tools.', 'em-quick-search');
  if (e.target.id === 'dr-quick-search')  renderQuickList('dr-quick-cards', t => t.type === 'DRILL' || t.type === 'CSINK', 'drill', 'No drill tools.', 'dr-quick-search');
  if (e.target.id === 'tap-quick-search') renderQuickList('tap-quick-cards', t => t.type === 'TAP', 'tapping', 'No tap tools.', 'tap-quick-search');
});

// ── Utility ──
function escH(s) {
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;');
}

// ══════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════
loadFSLib();
loadFSUsage();
renderFSLibrary();
renderQuickCards();
setupMirrors();
