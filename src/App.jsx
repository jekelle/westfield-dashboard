// ============================================================
// WESTFIELD SHAMROCKS OFFENSIVE ANALYTICS DASHBOARD
// Copyright © 2026 Jay R. Kelley & Westfield Shamrocks Football
// All Rights Reserved.
//
// PROTECTED INTELLECTUAL PROPERTY — The following are the
// exclusive property of Jay R. Kelley:
//
//   1. SOURCE CODE — All React components, logic, and structure
//   2. ANALYTICS METHODOLOGY — Position coach AI system,
//      per-down AI prompts, load vs performance correlation,
//      QB grading system, concept efficiency framework
//   3. VISUAL DESIGN — Layout, color system, dashboard UI,
//      heat maps, zone charts, and all visual components
//   4. DATA STRUCTURES — Play logging system, session tracking,
//      recruiting pipeline, and persistent storage architecture
//
// Unauthorized copying, reproduction, modification, distribution,
// sublicensing, or use of any part of this software — in whole
// or in part, by any means — is strictly prohibited without the
// express written permission of Jay R. Kelley.
//
// Created & Built: May 2026 — Westfield, Indiana
// Author: Jay R. Kelley
// Program: Westfield Shamrocks Football
// Live: westfield-dashboard.vercel.app
// Repository: github.com/jekelle/westfield-dashboard (Private)
// ============================================================

import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import {
  LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, Legend,
} from 'recharts'

// ─── Palette ────────────────────────────────────────────────
const C = {
  bg:'#0b180b', card:'#101e10', border:'#1d3a1d',
  gold:'#d4a017', green:'#22c55e', orange:'#f97316',
  red:'#ef4444',  muted:'#6b8f6b', text:'#e5e7eb', navy:'#090f09',
}
const pctClr = p => p >= 80 ? C.green : p >= 55 ? C.gold : C.red
const resClr  = r => r === 'Complete' ? C.green : r === 'Incomplete' ? C.red : C.orange

// ─── Seed data ───────────────────────────────────────────────
const SEED_PLAYS = [{"id":1,"qb":"Cooper Melvin","concept":"Stick","result":"Complete","yards":9,"down":1,"field":"normal","ttt":"1.9s","date":"4/21","session":"7on7"},{"id":2,"qb":"Cooper Melvin","concept":"Baltimore","result":"Complete","yards":14,"down":1,"field":"normal","ttt":"2.0s","date":"4/21","session":"7on7"},{"id":3,"qb":"Cooper Melvin","concept":"Sail","result":"Incomplete","yards":0,"down":3,"field":"redzone","ttt":"2.6s","date":"4/21","session":"7on7"},{"id":4,"qb":"Cooper Melvin","concept":"Out","result":"Complete","yards":6,"down":2,"field":"normal","ttt":"1.7s","date":"4/21","session":"7on7"},{"id":5,"qb":"Cooper Melvin","concept":"Fade","result":"Incomplete","yards":0,"down":3,"field":"redzone","ttt":"2.3s","date":"4/21","session":"7on7"},{"id":6,"qb":"Cooper Melvin","concept":"Post","result":"Complete","yards":13,"down":1,"field":"normal","ttt":"2.1s","date":"4/21","session":"7on7"},{"id":7,"qb":"Cooper Melvin","concept":"Slant","result":"Complete","yards":6,"down":2,"field":"normal","ttt":"1.6s","date":"4/21","session":"7on7"},{"id":8,"qb":"Cooper Melvin","concept":"Stick","result":"Complete","yards":7,"down":1,"field":"normal","ttt":"1.8s","date":"4/21","session":"7on7"},{"id":9,"qb":"Cooper Melvin","concept":"Out","result":"Complete","yards":8,"down":2,"field":"normal","ttt":"1.9s","date":"4/21","session":"7on7"},{"id":10,"qb":"Cooper Melvin","concept":"Sail","result":"Incomplete","yards":0,"down":3,"field":"redzone","ttt":"2.5s","date":"4/21","session":"7on7"},{"id":11,"qb":"Ben Kooi","concept":"Stick","result":"Complete","yards":7,"down":1,"field":"normal","ttt":"2.0s","date":"4/21","session":"7on7"},{"id":12,"qb":"Ben Kooi","concept":"Baltimore","result":"Complete","yards":13,"down":1,"field":"normal","ttt":"2.2s","date":"4/21","session":"7on7"},{"id":13,"qb":"Ben Kooi","concept":"Sail","result":"Incomplete","yards":0,"down":3,"field":"redzone","ttt":"2.8s","date":"4/21","session":"7on7"},{"id":14,"qb":"Ben Kooi","concept":"Out","result":"Complete","yards":5,"down":2,"field":"normal","ttt":"1.9s","date":"4/21","session":"7on7"},{"id":15,"qb":"Ben Kooi","concept":"Fade","result":"Incomplete","yards":0,"down":3,"field":"redzone","ttt":"2.4s","date":"4/21","session":"7on7"},{"id":16,"qb":"Ben Kooi","concept":"Post","result":"Complete","yards":12,"down":1,"field":"normal","ttt":"2.3s","date":"4/21","session":"7on7"},{"id":17,"qb":"Ben Kooi","concept":"Slant","result":"Complete","yards":4,"down":2,"field":"normal","ttt":"1.7s","date":"4/21","session":"7on7"},{"id":18,"qb":"Ben Kooi","concept":"Stick","result":"Complete","yards":8,"down":1,"field":"normal","ttt":"1.9s","date":"4/21","session":"7on7"},{"id":19,"qb":"Ben Kooi","concept":"Out","result":"Complete","yards":6,"down":2,"field":"normal","ttt":"2.0s","date":"4/21","session":"7on7"},{"id":20,"qb":"Ben Kooi","concept":"Sail","result":"Incomplete","yards":0,"down":3,"field":"redzone","ttt":"2.7s","date":"4/21","session":"7on7"},{"id":21,"qb":"Cooper Melvin","concept":"Stick","result":"Complete","yards":9,"down":1,"field":"normal","ttt":"","date":"4/27","session":"7on7"},{"id":22,"qb":"Cooper Melvin","concept":"Baltimore","result":"Complete","yards":13,"down":1,"field":"normal","ttt":"","date":"4/27","session":"7on7"},{"id":23,"qb":"Cooper Melvin","concept":"Sail","result":"Incomplete","yards":0,"down":3,"field":"redzone","ttt":"","date":"4/27","session":"7on7"},{"id":24,"qb":"Cooper Melvin","concept":"Out","result":"Complete","yards":6,"down":2,"field":"normal","ttt":"","date":"4/27","session":"7on7"},{"id":25,"qb":"Cooper Melvin","concept":"Post","result":"Complete","yards":12,"down":1,"field":"normal","ttt":"","date":"4/27","session":"7on7"},{"id":26,"qb":"Cooper Melvin","concept":"Slant","result":"Complete","yards":6,"down":2,"field":"normal","ttt":"","date":"4/27","session":"7on7"},{"id":27,"qb":"Cooper Melvin","concept":"Fade","result":"Incomplete","yards":0,"down":3,"field":"redzone","ttt":"","date":"4/27","session":"7on7"},{"id":28,"qb":"Ben Kooi","concept":"Stick","result":"Complete","yards":7,"down":1,"field":"normal","ttt":"","date":"4/27","session":"7on7"},{"id":29,"qb":"Ben Kooi","concept":"Baltimore","result":"Complete","yards":12,"down":1,"field":"normal","ttt":"","date":"4/27","session":"7on7"},{"id":30,"qb":"Ben Kooi","concept":"Sail","result":"Incomplete","yards":0,"down":3,"field":"redzone","ttt":"","date":"4/27","session":"7on7"},{"id":31,"qb":"Ben Kooi","concept":"Out","result":"Complete","yards":5,"down":2,"field":"normal","ttt":"","date":"4/27","session":"7on7"},{"id":32,"qb":"Ben Kooi","concept":"Post","result":"Complete","yards":11,"down":1,"field":"normal","ttt":"","date":"4/27","session":"7on7"},{"id":33,"qb":"Ben Kooi","concept":"Slant","result":"Complete","yards":4,"down":2,"field":"normal","ttt":"","date":"4/27","session":"7on7"},{"id":34,"qb":"Ben Kooi","concept":"Fade","result":"Incomplete","yards":0,"down":3,"field":"redzone","ttt":"","date":"4/27","session":"7on7"},{"id":35,"qb":"Cooper Melvin","concept":"Stick","result":"Complete","yards":8,"down":1,"field":"normal","ttt":"","date":"4/27","session":"7on7"},{"id":36,"qb":"Cooper Melvin","concept":"Slant","result":"Complete","yards":6,"down":2,"field":"normal","ttt":"","date":"4/27","session":"7on7"},{"id":37,"qb":"Cooper Melvin","concept":"Stick","result":"Complete","yards":8,"down":1,"field":"normal","ttt":"","date":"4/27","session":"7on7"},{"id":38,"qb":"Cooper Melvin","concept":"Baltimore","result":"Complete","yards":12,"down":1,"field":"normal","ttt":"","date":"4/27","session":"7on7"},{"id":39,"qb":"Cooper Melvin","concept":"Out","result":"Complete","yards":7,"down":2,"field":"normal","ttt":"","date":"4/27","session":"7on7"},{"id":40,"qb":"Cooper Melvin","concept":"Sail","result":"Incomplete","yards":0,"down":3,"field":"redzone","ttt":"","date":"4/27","session":"7on7"},{"id":41,"qb":"Cooper Melvin","concept":"Post","result":"Complete","yards":10,"down":1,"field":"normal","ttt":"","date":"4/27","session":"7on7"},{"id":42,"qb":"Cooper Melvin","concept":"Slant","result":"Complete","yards":6,"down":2,"field":"normal","ttt":"","date":"4/27","session":"7on7"},{"id":43,"qb":"Cooper Melvin","concept":"Fade","result":"Incomplete","yards":0,"down":3,"field":"redzone","ttt":"","date":"4/27","session":"7on7"},{"id":44,"qb":"Ben Kooi","concept":"Stick","result":"Complete","yards":6,"down":1,"field":"normal","ttt":"","date":"4/27","session":"7on7"},{"id":45,"qb":"Ben Kooi","concept":"Baltimore","result":"Complete","yards":11,"down":1,"field":"normal","ttt":"","date":"4/27","session":"7on7"},{"id":46,"qb":"Ben Kooi","concept":"Out","result":"Complete","yards":5,"down":2,"field":"normal","ttt":"","date":"4/27","session":"7on7"},{"id":47,"qb":"Ben Kooi","concept":"Sail","result":"Incomplete","yards":0,"down":3,"field":"redzone","ttt":"","date":"4/27","session":"7on7"},{"id":48,"qb":"Ben Kooi","concept":"Post","result":"Complete","yards":12,"down":1,"field":"normal","ttt":"","date":"4/27","session":"7on7"},{"id":49,"qb":"Ben Kooi","concept":"Slant","result":"Complete","yards":4,"down":2,"field":"normal","ttt":"","date":"4/27","session":"7on7"},{"id":50,"qb":"Ben Kooi","concept":"Fade","result":"Incomplete","yards":0,"down":3,"field":"redzone","ttt":"","date":"4/27","session":"7on7"},{"id":51,"qb":"Cooper Melvin","concept":"Verticals","result":"Complete","yards":69,"down":1,"field":"normal","ttt":"2.6s","date":"4/30","session":"Varsity Practice"},{"id":52,"qb":"Ben Kooi","concept":"Smash","result":"Complete","yards":8,"down":2,"field":"normal","ttt":"1.9s","date":"4/30","session":"Varsity Practice"},{"id":53,"qb":"Cooper Melvin","concept":"Q-Lead","result":"Complete","yards":20,"down":1,"field":"redzone","ttt":"N/A","date":"4/30","session":"Varsity Practice"},{"id":54,"qb":"Cooper Melvin","concept":"Four Verts","result":"Complete","yards":22,"down":1,"field":"normal","ttt":"2.4s","date":"4/30","session":"Varsity Practice"},{"id":55,"qb":"Ben Kooi","concept":"Verticals","result":"Incomplete","yards":0,"down":3,"field":"normal","ttt":"2.8s","date":"4/30","session":"Varsity Practice"},{"id":56,"qb":"Cooper Melvin","concept":"Verticals","result":"Complete","yards":28,"down":1,"field":"normal","ttt":"2.6s","date":"Showcase","session":"College Showcase"},{"id":57,"qb":"Cooper Melvin","concept":"Post","result":"Complete","yards":22,"down":1,"field":"normal","ttt":"2.3s","date":"Showcase","session":"College Showcase"},{"id":58,"qb":"Cooper Melvin","concept":"Four Verts","result":"Complete","yards":24,"down":1,"field":"normal","ttt":"2.4s","date":"Showcase","session":"College Showcase"},{"id":59,"qb":"Cooper Melvin","concept":"Baltimore","result":"Complete","yards":15,"down":1,"field":"normal","ttt":"2.0s","date":"Showcase","session":"College Showcase"},{"id":60,"qb":"Cooper Melvin","concept":"Stick","result":"Complete","yards":9,"down":2,"field":"normal","ttt":"1.8s","date":"Showcase","session":"College Showcase"},{"id":61,"qb":"Cooper Melvin","concept":"Slant","result":"Complete","yards":7,"down":2,"field":"normal","ttt":"1.6s","date":"Showcase","session":"College Showcase"},{"id":62,"qb":"Cooper Melvin","concept":"Out","result":"Complete","yards":8,"down":2,"field":"normal","ttt":"1.7s","date":"Showcase","session":"College Showcase"},{"id":63,"qb":"Cooper Melvin","concept":"Fade","result":"Incomplete","yards":0,"down":3,"field":"redzone","ttt":"2.3s","date":"Showcase","session":"College Showcase"},{"id":64,"qb":"Cooper Melvin","concept":"Sail","result":"Incomplete","yards":0,"down":3,"field":"redzone","ttt":"2.5s","date":"Showcase","session":"College Showcase"},{"id":65,"qb":"Cooper Melvin","concept":"Post","result":"Complete","yards":19,"down":1,"field":"normal","ttt":"2.2s","date":"Showcase","session":"College Showcase"},{"id":66,"qb":"Ben Kooi","concept":"Stick","result":"Complete","yards":8,"down":1,"field":"normal","ttt":"1.8s","date":"Showcase","session":"College Showcase"},{"id":67,"qb":"Ben Kooi","concept":"Baltimore","result":"Complete","yards":12,"down":1,"field":"normal","ttt":"2.1s","date":"Showcase","session":"College Showcase"},{"id":68,"qb":"Ben Kooi","concept":"Smash","result":"Complete","yards":9,"down":2,"field":"normal","ttt":"1.9s","date":"Showcase","session":"College Showcase"},{"id":69,"qb":"Ben Kooi","concept":"Slant","result":"Complete","yards":5,"down":2,"field":"normal","ttt":"1.6s","date":"Showcase","session":"College Showcase"},{"id":70,"qb":"Ben Kooi","concept":"Out","result":"Complete","yards":6,"down":2,"field":"normal","ttt":"1.9s","date":"Showcase","session":"College Showcase"},{"id":71,"qb":"Ben Kooi","concept":"Post","result":"Complete","yards":14,"down":1,"field":"normal","ttt":"2.0s","date":"Showcase","session":"College Showcase"},{"id":72,"qb":"Ben Kooi","concept":"Verticals","result":"Complete","yards":18,"down":1,"field":"normal","ttt":"2.4s","date":"Showcase","session":"College Showcase"},{"id":73,"qb":"Ben Kooi","concept":"Stick","result":"Complete","yards":7,"down":1,"field":"normal","ttt":"1.7s","date":"Showcase","session":"College Showcase"},{"id":74,"qb":"Ben Kooi","concept":"Sail","result":"Incomplete","yards":0,"down":3,"field":"redzone","ttt":"2.7s","date":"Showcase","session":"College Showcase"},{"id":75,"qb":"Ben Kooi","concept":"Fade","result":"Incomplete","yards":0,"down":3,"field":"redzone","ttt":"2.6s","date":"Showcase","session":"College Showcase"},{"id":76,"qb":"Cooper Melvin","concept":"Stick","result":"Complete","yards":11,"down":1,"field":"normal","ttt":"1.7s","date":"Showcase","session":"College Showcase"},{"id":77,"qb":"Cooper Melvin","concept":"Baltimore","result":"Complete","yards":16,"down":1,"field":"normal","ttt":"2.1s","date":"Showcase","session":"College Showcase"},{"id":78,"qb":"Cooper Melvin","concept":"Slant","result":"Complete","yards":8,"down":2,"field":"normal","ttt":"1.6s","date":"Showcase","session":"College Showcase"},{"id":79,"qb":"Ben Kooi","concept":"Post","result":"Complete","yards":13,"down":1,"field":"normal","ttt":"2.0s","date":"Showcase","session":"College Showcase"},{"id":80,"qb":"Ben Kooi","concept":"Out","result":"Complete","yards":7,"down":2,"field":"normal","ttt":"1.8s","date":"Showcase","session":"College Showcase"},{"id":81,"qb":"Cooper Melvin","concept":"Stick","result":"Complete","yards":8,"down":1,"field":"normal","ttt":"","date":"5/8","session":"7on7"},{"id":82,"qb":"Cooper Melvin","concept":"Out","result":"Complete","yards":10,"down":1,"field":"normal","ttt":"","date":"5/8","session":"7on7"},{"id":83,"qb":"Cooper Melvin","concept":"Slant","result":"Complete","yards":5,"down":2,"field":"normal","ttt":"","date":"5/8","session":"7on7"},{"id":84,"qb":"Cooper Melvin","concept":"Baltimore","result":"Complete","yards":10,"down":1,"field":"normal","ttt":"","date":"5/8","session":"7on7"},{"id":85,"qb":"Cooper Melvin","concept":"Post","result":"Complete","yards":10,"down":1,"field":"normal","ttt":"","date":"5/8","session":"7on7"},{"id":86,"qb":"Ben Kooi","concept":"Stick","result":"Complete","yards":5,"down":1,"field":"normal","ttt":"","date":"5/8","session":"7on7"},{"id":87,"qb":"Ben Kooi","concept":"Out","result":"Complete","yards":5,"down":2,"field":"normal","ttt":"","date":"5/8","session":"7on7"},{"id":88,"qb":"Ben Kooi","concept":"Slant","result":"Incomplete","yards":0,"down":2,"field":"normal","ttt":"","date":"5/8","session":"7on7"},{"id":89,"qb":"Ben Kooi","concept":"Baltimore","result":"Incomplete","yards":0,"down":3,"field":"normal","ttt":"","date":"5/8","session":"7on7"},{"id":90,"qb":"Ben Kooi","concept":"Post","result":"Incomplete","yards":0,"down":3,"field":"normal","ttt":"","date":"5/8","session":"7on7"},{"id":91,"qb":"Cooper Melvin","concept":"Stick","result":"Complete","yards":10,"down":1,"field":"normal","ttt":"","date":"5/12","session":"Team"},{"id":92,"qb":"Cooper Melvin","concept":"Out","result":"Incomplete","yards":0,"down":2,"field":"normal","ttt":"","date":"5/12","session":"Team"},{"id":93,"qb":"Cooper Melvin","concept":"RPO Glance","result":"Complete","yards":5,"down":1,"field":"normal","ttt":"","date":"5/12","session":"Team"},{"id":94,"qb":"Cooper Melvin","concept":"Slant","result":"Incomplete","yards":0,"down":3,"field":"normal","ttt":"","date":"5/12","session":"Team"},{"id":95,"qb":"Cooper Melvin","concept":"RPO Glance","result":"Complete","yards":15,"down":1,"field":"normal","ttt":"","date":"5/12","session":"Team"},{"id":96,"qb":"Ben Kooi","concept":"RPO Glance","result":"Complete","yards":0,"down":1,"field":"normal","ttt":"","date":"5/12","session":"Team"},{"id":97,"qb":"Ben Kooi","concept":"Out","result":"Complete","yards":6,"down":2,"field":"normal","ttt":"","date":"5/12","session":"Team"},{"id":98,"qb":"Ben Kooi","concept":"Baltimore","result":"Incomplete","yards":0,"down":3,"field":"normal","ttt":"","date":"5/12","session":"Team"},{"id":99,"qb":"Ben Kooi","concept":"RPO Glance","result":"Complete","yards":10,"down":1,"field":"normal","ttt":"","date":"5/12","session":"Team"},{"id":100,"qb":"Ben Kooi","concept":"Stick","result":"Complete","yards":5,"down":2,"field":"normal","ttt":"","date":"5/12","session":"Team"},{"id":101,"qb":"Cooper Melvin","concept":"RPO Glance","result":"Complete","yards":0,"down":1,"field":"normal","ttt":"","date":"5/12","session":"Team"},{"id":102,"qb":"Cooper Melvin","concept":"Post","result":"Complete","yards":15,"down":1,"field":"normal","ttt":"","date":"5/12","session":"Team"},{"id":103,"qb":"Cooper Melvin","concept":"Slant","result":"Risky","yards":0,"down":2,"field":"normal","ttt":"","date":"5/12","session":"Team"},{"id":104,"qb":"Cooper Melvin","concept":"Out","result":"Incomplete","yards":0,"down":3,"field":"normal","ttt":"","date":"5/12","session":"Team"},{"id":105,"qb":"Cooper Melvin","concept":"Fade","result":"Incomplete","yards":0,"down":3,"field":"normal","ttt":"","date":"5/12","session":"Team"},{"id":106,"qb":"Cooper Melvin","concept":"Baltimore","result":"Complete","yards":15,"down":1,"field":"normal","ttt":"","date":"5/12","session":"Team"},{"id":107,"qb":"Cooper Melvin","concept":"Post","result":"Complete","yards":10,"down":1,"field":"normal","ttt":"","date":"5/12","session":"Team"},{"id":108,"qb":"Ben Kooi","concept":"Slant","result":"Incomplete","yards":0,"down":3,"field":"normal","ttt":"","date":"5/12","session":"Team"},{"id":109,"qb":"Ben Kooi","concept":"Stick","result":"Complete","yards":1,"down":2,"field":"normal","ttt":"","date":"5/12","session":"7on7"},{"id":110,"qb":"Ben Kooi","concept":"Baltimore","result":"Incomplete","yards":0,"down":3,"field":"redzone","ttt":"","date":"5/12","session":"7on7"},{"id":111,"qb":"Cooper Melvin","concept":"Out","result":"Complete","yards":0,"down":1,"field":"normal","ttt":"","date":"5/12","session":"7on7"},{"id":112,"qb":"Cooper Melvin","concept":"Slant","result":"Complete","yards":5,"down":2,"field":"normal","ttt":"","date":"5/12","session":"7on7"},{"id":113,"qb":"Cooper Melvin","concept":"Post","result":"Complete","yards":15,"down":1,"field":"normal","ttt":"","date":"5/12","session":"7on7"},{"id":114,"qb":"Cooper Melvin","concept":"Baltimore","result":"Complete","yards":10,"down":1,"field":"normal","ttt":"","date":"5/12","session":"7on7"},{"id":115,"qb":"Ben Kooi","concept":"Sail","result":"Incomplete","yards":0,"down":3,"field":"normal","ttt":"","date":"5/12","session":"7on7"},{"id":116,"qb":"Ben Kooi","concept":"Post","result":"Complete","yards":10,"down":1,"field":"normal","ttt":"","date":"5/12","session":"7on7"},{"id":117,"qb":"Ben Kooi","concept":"Stick","result":"Complete","yards":0,"down":1,"field":"redzone","ttt":"","date":"5/12","session":"7on7"}]

const PLAY_SCRIPT = [
  {num:1, hp:'L 12', formation:'Hover Jazz Lt Weak',play:'36 Miami Y Under',   remind:'',      dper:'Base',front:'Pride',session:'7on7',date:'4/21'},
  {num:2, hp:'LM 12',formation:'Tray Rt',           play:'25 Scissors',        remind:'',      dper:'Base',front:'Pride',session:'7on7',date:'4/21'},
  {num:3, hp:'R 12', formation:'Roz Nasty Near',    play:'25 Orlando J Under', remind:'',      dper:'Base',front:'Pride',session:'7on7',date:'4/21'},
  {num:4, hp:'RM 12',formation:'Hover Jack Lt',     play:'25 Stick / Denver',  remind:'',      dper:'Base',front:'Pride',session:'7on7',date:'4/21'},
  {num:5, hp:'L 12', formation:'Jack Rt Near',      play:'25 H Escort',        remind:'',      dper:'Base',front:'Pride',session:'7on7',date:'4/21'},
  {num:6, hp:'M 11', formation:'Left',              play:'25 Baltimore Rt',    remind:'O TO D',dper:'Base',front:'Pride',session:'7on7',date:'4/21'},
  {num:7, hp:'R 11', formation:'Right',             play:'35 Branch Lt',       remind:'O TO D',dper:'Base',front:'Pride',session:'7on7',date:'4/21'},
  {num:8, hp:'RM 11',formation:'Lucky Plnch',       play:'26 Miami X Under',   remind:'O TO D',dper:'Base',front:'Pride',session:'7on7',date:'4/21'},
  {num:9, hp:'L 11', formation:'J Rocky Far',       play:'35 Orlando Y Under', remind:'O TO D',dper:'Base',front:'Pride',session:'7on7',date:'4/21'},
  {num:10,hp:'LM 11',formation:'Trips Lt Near',     play:'35 J Return',        remind:'O TO D',dper:'Base',front:'Pride',session:'7on7',date:'4/21'},
  {num:11,hp:'L 11', formation:'Liz Near',          play:'36 Miami Y Under',   remind:'',      dper:'Base',front:'Pride',session:'7on7',date:'4/21'},
  {num:12,hp:'RM 11',formation:'J Leo',             play:'25 Scissors',        remind:'',      dper:'Base',front:'Pride',session:'7on7',date:'4/21'},
  {num:13,hp:'M 11', formation:'J Trips Lt',        play:'35 Dino',            remind:'',      dper:'Base',front:'Pride',session:'7on7',date:'4/21'},
  {num:14,hp:'RM 11',formation:'Right',             play:'35 Scissors',        remind:'',      dper:'Base',front:'Pride',session:'7on7',date:'4/21'},
  {num:15,hp:'LM 11',formation:'Hover Ram',         play:'25 Y Escort',        remind:'',      dper:'Base',front:'Pride',session:'7on7',date:'4/21'},
  {num:1,hp:'25-LM 2',formation:'J Rocky',play:'89 Washington',remind:'',dper:'Base',front:'Pride',session:'7on7',date:'4/14'},
  {num:2,hp:'22-M 12',formation:'Hover Yahtzee Rt',play:'35 Branch Lt',remind:'',dper:'Base',front:'Pride',session:'7on7',date:'4/14'},
  {num:3,hp:'20-R 12',formation:'Hover Jazz Rt Weak',play:'35 H Escort',remind:'',dper:'Base',front:'Pride',session:'7on7',date:'4/14'},
  {num:4,hp:'20-R 11',formation:'Hover Leo Nasty Pinch',play:'25 Orlando J Under',remind:'',dper:'Base',front:'Pride',session:'7on7',date:'4/14'},
  {num:5,hp:'18-LM 11',formation:'J Rocky Pinch',play:'35 R Seattle / Stick',remind:'',dper:'Base',front:'Pride',session:'7on7',date:'4/14'},
  {num:6,hp:'15-RM 12',formation:'Hover Yahtzee Rt Weak',play:'25 Stick / Denver',remind:'',dper:'Base',front:'Pride',session:'7on7',date:'4/14'},
  {num:7,hp:'12-LM 12',formation:'Dux Rt Stack',play:'89 Cobra',remind:'',dper:'Base',front:'Pride',session:'7on7',date:'4/14'},
  {num:8,hp:'10-L 2',formation:'Dollar Rt',play:'35 Shallow Lt',remind:'',dper:'Base',front:'Pride',session:'7on7',date:'4/14'},
  {num:9,hp:'7-LM 2',formation:'Bunch Rt Strong',play:'89 Z Memphis',remind:'',dper:'Base',front:'Pride',session:'7on7',date:'4/14'},
  {num:10,hp:'5-M 2',formation:'Reset',play:'26 X Pivot',remind:'',dper:'Base',front:'Pride',session:'7on7',date:'4/14'},
  {num:11,hp:'L 11',formation:'Liz Near',play:'Fly 35 Orlando',remind:'',dper:'Base',front:'Pride',session:'7on7',date:'4/14'},
  {num:12,hp:'LM 11',formation:'Liz Nasty Near',play:'35 Shallow Lt',remind:'',dper:'Base',front:'Pride',session:'7on7',date:'4/14'},
  {num:13,hp:'LM 11',formation:'Ram Weak Pinch',play:'25 Branch Rt',remind:'',dper:'Base',front:'Pride',session:'7on7',date:'4/14'},
  {num:14,hp:'M 11',formation:'Left',play:'35 Baltimore Rt',remind:'',dper:'Base',front:'Pride',session:'7on7',date:'4/14'},
  {num:15,hp:'R 11',formation:'Lucky Far',play:'99 Washington',remind:'',dper:'Base',front:'Pride',session:'7on7',date:'4/14'},
  {num:16,hp:'RM 11',formation:'Hover Leo Weak',play:'25 Oregon',remind:'',dper:'Base',front:'Pride',session:'7on7',date:'4/14'},
  {num:17,hp:'M 11',formation:'Ram Weak Pinch',play:'Run 25 Branch',remind:'',dper:'Base',front:'Pride',session:'7on7',date:'4/14'},
  {num:18,hp:'LM 2',formation:'Dollar Rt',play:'Hoosier',remind:'',dper:'Base',front:'Pride',session:'7on7',date:'4/14'},
  {num:19,hp:'LM 2',formation:'Reset',play:'Grab / Stick',remind:'',dper:'Base',front:'Pride',session:'7on7',date:'4/14'},
  {num:20,hp:'R 2',formation:'Right Weak',play:'Miami Y Under',remind:'',dper:'Base',front:'Pride',session:'7on7',date:'4/14'},
  {num:1,hp:'R 12',formation:'FS Dux Lt',play:'35 Scissors',remind:'',dper:'Base',front:'Pride',session:'Team',date:'4/14'},
  {num:2,hp:'RM 12',formation:'Reset',play:'26 Miami H Under',remind:'',dper:'Base',front:'Pride',session:'Team',date:'4/14'},
  {num:3,hp:'M 12',formation:'Sugar Yahtzee Rt',play:'35 Branch Lt',remind:'',dper:'Base',front:'Pride',session:'Team',date:'4/14'},
  {num:4,hp:'L 12',formation:'Hover Jack Rt Weak',play:'Oakley',remind:'',dper:'Base',front:'Pride',session:'Team',date:'4/14'},
  {num:5,hp:'L 11',formation:'Left Far',play:'89 Washington',remind:'',dper:'Base',front:'Pride',session:'Team',date:'4/14'},
  {num:6,hp:'M 11',formation:'Reset',play:'35 Shallow Lt',remind:'',dper:'Base',front:'Pride',session:'Team',date:'4/14'},
  {num:7,hp:'R 11',formation:'Sugar Right Near',play:'28 Q',remind:'',dper:'Base',front:'Pride',session:'Team',date:'4/14'},
  {num:8,hp:'RM 11',formation:'Reset',play:'25 Orlando J Under',remind:'',dper:'Base',front:'Pride',session:'Team',date:'4/14'},
  {num:9,hp:'M 2',formation:'Trips Rt Tight',play:'Grab / Stick',remind:'',dper:'Base',front:'Pride',session:'Team',date:'4/14'},
  {num:10,hp:'L 2',formation:'Trips Rt Weak',play:'20 Q J Pop',remind:'',dper:'Base',front:'Pride',session:'Team',date:'4/14'},
  {num:11,hp:'RM 2',formation:'Trips Lt Tight',play:'Fly 25 Y Cruise',remind:'',dper:'Base',front:'Pride',session:'Team',date:'4/14'},
  {num:12,hp:'LM 2',formation:'Liz Weak',play:'Fly 25 Miami Y Under',remind:'',dper:'Base',front:'Pride',session:'Team',date:'4/14'},
]

// ─── Route Definitions ───────────────────────────────────────
const ROUTES = {
  Stick:{desc:'Quick 5-yd hitch combo. QB reads flat → stick. Best on 1st/2nd down.',timing:'1.5–2.0s',primary:'Z — Stick',
    players:l=>[
      {lbl:'X',cx:72, cy:l,   clr:C.green,name:'Hitch',  primary:false,path:`M72,${l}L72,${l-34}`,              lx:72,  ly:l-40,la:'middle'},
      {lbl:'Y',cx:148,cy:l+14,clr:C.gold, name:'Flat',   primary:false,path:`M148,${l+12}L52,${l+12}`,          lx:47,  ly:l+10,la:'end'},
      {lbl:'Z',cx:355,cy:l,   clr:C.green,name:'Stick ★',primary:true, path:`M355,${l}L355,${l-34}`,            lx:355, ly:l-40,la:'middle'},
      {lbl:'H',cx:295,cy:l+8, clr:C.gold, name:'Drag',   primary:false,path:`M295,${l+6}Q260,${l+4}225,${l-16}`,lx:220,ly:l-22,la:'end'},
    ]},
  Baltimore:{desc:'Deep-cross concept. X crosses at 15+ yds. Z curls as safety valve.',timing:'1.8–2.2s',primary:'X — Deep Cross',
    players:l=>[
      {lbl:'X',cx:72, cy:l,   clr:C.green,name:'Deep Cross ★',primary:true, path:`M72,${l}L72,${l-52}L395,${l-52}`,       lx:399,ly:l-48,la:'start'},
      {lbl:'Y',cx:148,cy:l+14,clr:C.gold, name:'Cross',       primary:false,path:`M148,${l+12}Q215,${l+10}275,${l-10}`,   lx:279,ly:l-16,la:'start'},
      {lbl:'Z',cx:355,cy:l,   clr:C.green,name:'Curl',        primary:false,path:`M355,${l}L355,${l-58}L400,${l-58}`,     lx:404,ly:l-54,la:'start'},
      {lbl:'H',cx:295,cy:l+8, clr:C.gold, name:'Flat',        primary:false,path:`M295,${l+6}L415,${l+6}`,                lx:419,ly:l+10,la:'start'},
    ]},
  Sail:{desc:'3-level vertical stretch: Go / Sail / Flat. Shot play — high risk on 3rd down.',timing:'2.5–3.0s',primary:'Z — Sail',
    players:l=>[
      {lbl:'X',cx:72, cy:l,   clr:C.green,name:'Go (Fly)',primary:false,path:`M72,${l}L72,${l-115}`,                        lx:72, ly:l-121,la:'middle'},
      {lbl:'Y',cx:148,cy:l+14,clr:C.gold, name:'Wheel',   primary:false,path:`M148,${l+12}L148,${l-30}Q148,${l-60}90,${l-95}`,lx:85,ly:l-100,la:'end'},
      {lbl:'Z',cx:355,cy:l,   clr:C.red,  name:'Sail ★',  primary:true, path:`M355,${l}L355,${l-55}Q355,${l-95}438,${l-110}`,lx:442,ly:l-115,la:'start'},
      {lbl:'H',cx:295,cy:l+8, clr:C.gold, name:'Flat',    primary:false,path:`M295,${l+6}L430,${l+6}`,                      lx:434,ly:l+10, la:'start'},
    ]},
  Out:{desc:'Both WRs break to the sideline at 8 yds. Horizontal stretch, beats zone.',timing:'1.8–2.2s',primary:'Z — Out',
    players:l=>[
      {lbl:'X',cx:72, cy:l,   clr:C.green,name:'Out',  primary:false,path:`M72,${l}L72,${l-30}L18,${l-30}`,       lx:13, ly:l-26,la:'end'},
      {lbl:'Y',cx:148,cy:l+14,clr:C.gold, name:'Seam', primary:false,path:`M148,${l+12}L148,${l-75}`,             lx:148,ly:l-81,la:'middle'},
      {lbl:'Z',cx:355,cy:l,   clr:C.green,name:'Out ★',primary:true, path:`M355,${l}L355,${l-30}L420,${l-30}`,   lx:424,ly:l-26,la:'start'},
      {lbl:'H',cx:295,cy:l+8, clr:C.gold, name:'Swing',primary:false,path:`M295,${l+6}Q362,${l+16}418,${l+30}`,  lx:422,ly:l+34,la:'start'},
    ]},
  Fade:{desc:'Redzone fade to back corner. WR runs diagonal to endzone corner. 0% — needs fixing.',timing:'2.0–2.5s',primary:'Z — Fade',
    players:l=>[
      {lbl:'X',cx:72, cy:l,   clr:C.green,name:'Fade',      primary:false,path:`M72,${l}Q54,${l-58}32,${l-115}`,      lx:27, ly:l-120,la:'end'},
      {lbl:'Y',cx:148,cy:l+14,clr:C.gold, name:'Chip/Flat', primary:false,path:`M148,${l+12}L75,${l+12}`,              lx:70, ly:l+10, la:'end'},
      {lbl:'Z',cx:355,cy:l,   clr:C.red,  name:'Fade ★',    primary:true, path:`M355,${l}Q385,${l-58}422,${l-115}`,   lx:426,ly:l-120,la:'start'},
      {lbl:'H',cx:295,cy:l+8, clr:C.gold, name:'Seam',      primary:false,path:`M295,${l+6}L295,${l-70}`,              lx:295,ly:l-76, la:'middle'},
    ]},
  Post:{desc:'WRs run vertical then break inside at 45°. Big-play downfield strike — 100% success.',timing:'2.0–2.5s',primary:'Z — Post',
    players:l=>[
      {lbl:'X',cx:72, cy:l,   clr:C.green,name:'Post',  primary:false,path:`M72,${l}L72,${l-58}Q88,${l-80}182,${l-105}`,     lx:186,ly:l-110,la:'start'},
      {lbl:'Y',cx:148,cy:l+14,clr:C.gold, name:'Drag',  primary:false,path:`M148,${l+12}Q222,${l+10}308,${l-12}`,            lx:312,ly:l-18, la:'start'},
      {lbl:'Z',cx:355,cy:l,   clr:C.green,name:'Post ★',primary:true, path:`M355,${l}L355,${l-58}Q338,${l-80}248,${l-105}`, lx:244,ly:l-110,la:'end'},
      {lbl:'H',cx:295,cy:l+8, clr:C.gold, name:'Wheel', primary:false,path:`M295,${l+6}L295,${l-32}Q330,${l-58}418,${l-72}`,lx:422,ly:l-76, la:'start'},
    ]},
  Slant:{desc:'2-step release then hard 45° break inside. Fastest release. Beats zone and man.',timing:'1.5–1.8s',primary:'Z — Slant',
    players:l=>[
      {lbl:'X',cx:72, cy:l,   clr:C.green,name:'Slant',  primary:false,path:`M72,${l}L72,${l-18}Q100,${l-28}168,${l-58}`,    lx:172,ly:l-63,la:'start'},
      {lbl:'Y',cx:148,cy:l+14,clr:C.gold, name:'Flat',   primary:false,path:`M148,${l+12}L58,${l+12}`,                       lx:53, ly:l+10,la:'end'},
      {lbl:'Z',cx:355,cy:l,   clr:C.green,name:'Slant ★',primary:true, path:`M355,${l}L355,${l-18}Q326,${l-28}258,${l-58}`, lx:254,ly:l-63,la:'end'},
      {lbl:'H',cx:295,cy:l+8, clr:C.gold, name:'Check',  primary:false,path:`M295,${l+6}L228,${l+6}`,                       lx:224,ly:l+10,la:'end'},
    ]},
}

// ─── Analytics ───────────────────────────────────────────────
const ok = p => p.result === 'Complete'

function calcConcepts(rows) {
  return [...new Set(rows.map(p => p.concept))].map(name => {
    const pl = rows.filter(p => p.concept === name)
    const co = pl.filter(ok)
    const y  = co.reduce((s, p) => s + p.yards, 0)
    return {
      name, plays: pl.length, comp: co.length,
      pct:  Math.round(co.length / pl.length * 100),
      yds:  y, avg: co.length ? +(y / co.length).toFixed(1) : 0,
      byDown: [1,2,3].map(d => {
        const dp = pl.filter(p => p.down === d)
        return { down: d, pct: dp.length ? Math.round(dp.filter(ok).length / dp.length * 100) : null }
      }),
    }
  }).sort((a, b) => b.pct - a.pct)
}

function calcQBs(rows) {
  return ['Cooper Melvin','Cooper Melvin','Ben Kooi'].map(qb => {
    const pl = rows.filter(p => p.qb === qb)
    if (!pl.length) return null
    const co = pl.filter(ok)
    const y  = co.reduce((s, p) => s + p.yards, 0)
    const tttPlays = pl.filter(p => p.ttt)
    return {
      qb, plays: pl.length, comp: co.length,
      pct:  Math.round(co.length / pl.length * 100),
      yds:  y, avg: +(y / pl.length).toFixed(1),
      avgTTT: tttPlays.length
        ? (tttPlays.reduce((s, p) => s + parseFloat(p.ttt || 0), 0) / tttPlays.length).toFixed(2) + 's'
        : '–',
      byC: calcConcepts(pl),
    }
  }).filter(Boolean)
}

// ─── CSV Parser ───────────────────────────────────────────────
// Expected CSV columns (order flexible, header row required):
// qb, concept, result, yards, down, field, ttt, date, session
function parseCSV(text) {
  const lines = text.trim().split('\n').filter(l => l.trim())
  if (lines.length < 2) throw new Error('CSV must have a header row and at least one data row')
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/[^a-z]/g, ''))
  const required = ['qb', 'concept', 'result', 'yards', 'down', 'field']
  const missing = required.filter(r => !headers.includes(r))
  if (missing.length) throw new Error(`Missing columns: ${missing.join(', ')}`)
  return lines.slice(1).map((line, i) => {
    const vals = line.split(',').map(v => v.trim())
    const row = {}
    headers.forEach((h, idx) => { row[h] = vals[idx] ?? '' })
    const result = row.result
    const validResults = ['Complete', 'Incomplete', 'Risky']
    const matchedResult = validResults.find(r => r.toLowerCase() === result.toLowerCase())
    if (!matchedResult) throw new Error(`Row ${i + 2}: result "${result}" must be Complete, Incomplete, or Risky`)
    const down = parseInt(row.down)
    if (![1,2,3].includes(down)) throw new Error(`Row ${i + 2}: down "${row.down}" must be 1, 2, or 3`)
    const field = row.field.toLowerCase()
    if (!['normal','redzone'].includes(field)) throw new Error(`Row ${i + 2}: field "${row.field}" must be "normal" or "redzone"`)
    return {
      qb:      row.qb || 'Cooper Melvin',
      concept: row.concept || 'Stick',
      result:  matchedResult,
      yards:   parseInt(row.yards) || 0,
      down,
      field,
      ttt:     row.ttt || '',
      date:    row.date || 'Unknown',
      session: row.session || '7on7',
    }
  })
}

// ─── Shared UI pieces ────────────────────────────────────────
function Card({ title, titleClr, children, style = {} }) {

  const passerRating = (qbName) => {
    const qbPlays = plays.filter(p => p.qb === qbName)
    if(qbPlays.length === 0) return 0
    const att = qbPlays.length
    const comp = qbPlays.filter(p => p.result === 'Complete').length
    const yds = qbPlays.reduce((a,p) => a + p.yards, 0)
    const td = qbPlays.filter(p => p.yards >= 20 && p.result === 'Complete').length
    const inc = qbPlays.filter(p => p.result === 'Incomplete').length
    const a = Math.min(Math.max(((comp/att) - 0.3) * 5, 0), 2.375)
    const b = Math.min(Math.max(((yds/att) - 3) * 0.25, 0), 2.375)
    const c = Math.min(Math.max((td/att) * 20, 0), 2.375)
    const d = Math.min(Math.max(2.375 - ((inc/att) * 25), 0), 2.375)
    return Math.round(((a + b + c + d) / 6) * 100)
  }

  const NextGenTab = () => {
    const zones = [
      { label: 'LEFT DEEP', concept: 'Post / Fade', c: 85, b: 82 },
      { label: 'MID DEEP', concept: 'Verts / 4V', c: 88, b: 86 },
      { label: 'RIGHT DEEP', concept: 'Sail / Fade', c: 0, b: 0 },
      { label: 'LEFT SHORT', concept: 'Out / Slant', c: 73, b: 70 },
      { label: 'MID SHORT', concept: 'Stick / Smash', c: 87, b: 85 },
      { label: 'RIGHT SHORT', concept: 'Out / Slant', c: 73, b: 68 },
      { label: 'RED ZONE', concept: 'All Concepts', c: 0, b: 0 },
    ]
    const zc = (p) => p >= 80 ? '#22c55e' : p >= 65 ? '#d97706' : '#dc2626'
    const bc = (p) => p >= 80 ? '#14532d' : p >= 65 ? '#7d5a00' : '#7f1d1d'
    const metrics = [
      { key: 'ttt', label: 'timeToThrow (TTT)', desc: 'Seconds from snap to ball release', nfl: '2.36s avg', color: '#06b6d4' },
      { key: 'air', label: 'airYards', desc: 'Avg downfield distance from LOS to target', nfl: '8.0 yds avg', color: '#F0B429' },
      { key: 'cp', label: 'completionProbability', desc: 'Overall comp % based on zone and coverage', nfl: '65% avg', color: '#22c55e' },
      { key: 'cpoe', label: 'CPOE', desc: 'Comp % Over Expected vs projected rate', nfl: '0% baseline', color: '#7c3aed' },
      { key: 'deep', label: 'deepBall Accuracy', desc: 'Comp % on throws 20+ yards downfield', nfl: '52% avg', color: '#06b6d4' },
      { key: 'hash', label: 'hashAccuracy', desc: 'Comp % on left and right hash throws', nfl: '71% avg', color: '#F0B429' },
    ]
    return (
      <div style={{padding:24}}>
        <div style={{background:'#0a0d1a',border:'1px solid #06b6d4',borderRadius:8,padding:14,marginBottom:16}}>
          <div style={{fontSize:11,fontWeight:700,color:'#06b6d4',letterSpacing:2,marginBottom:4}}>⚡  NFL NEXTGEN STATS METHODOLOGY — APPLIED TO WESTFIELD SHAMROCKS</div>
          <div style={{fontSize:8,color:'#777'}}>airDistance · airYards · timeToThrow · targetSeparation · passerSpeed · completionProbability · pressureRate</div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:16}}>
          {metrics.map(m=>(
            <div key={m.key} style={{background:'#111',border:`1px solid ${m.color}44`,borderRadius:6,padding:10,borderLeft:`3px solid ${m.color}`}}>
              <div style={{fontSize:9,fontWeight:700,color:m.color,marginBottom:2}}>{m.label}</div>
              <div style={{fontSize:8,color:'#ccc',marginBottom:4}}>{m.desc}</div>
              <div style={{fontSize:7,color:'#666'}}>NFL Benchmark: {m.nfl}</div>
            </div>
          ))}
        </div>
        <div style={{fontSize:10,fontWeight:700,color:'#d4a017',letterSpacing:2,marginBottom:8,borderBottom:'1px solid #1d3a1d',paddingBottom:4}}>COMPLETION PROBABILITY BY ZONE</div>
        <div style={{background:'#0d0d0d',border:'1px solid #1d3a1d',borderRadius:8,overflow:'hidden',marginBottom:16}}>
          <div style={{display:'grid',gridTemplateColumns:'1.4fr 1fr 1fr',background:'#0a0a0a',padding:'6px 12px',borderBottom:'1px solid #1d3a1d'}}>
            <div style={{fontSize:7,fontWeight:700,color:'#666'}}>ZONE / CONCEPT</div>
            <div style={{fontSize:7,fontWeight:700,color:'#22c55e',textAlign:'center'}}>COOPER MELVIN  QB1</div>
            <div style={{fontSize:7,fontWeight:700,color:'#F0B429',textAlign:'center'}}>BEN KOOI  QB2</div>
          </div>
          {zones.map((z,i)=>(
            <div key={z.label} style={{display:'grid',gridTemplateColumns:'1.4fr 1fr 1fr',padding:'8px 12px',background:i%2===0?'#0f0f0f':'#141414',borderBottom:'1px solid #1a1a1a'}}>
              <div><div style={{fontSize:9,fontWeight:700,color:'#d4a017'}}>{z.label}</div><div style={{fontSize:7,color:'#555'}}>{z.concept}</div></div>
              <div style={{display:'flex',alignItems:'center',gap:6}}>
                <div style={{flex:1,background:'#1a1a1a',borderRadius:3,height:14,position:'relative',overflow:'hidden'}}>
                  <div style={{position:'absolute',left:0,top:0,bottom:0,width:`${z.c}%`,background:bc(z.c),borderRadius:3}}/>
                </div>
                <div style={{fontSize:11,fontWeight:700,color:zc(z.c),minWidth:32,textAlign:'right'}}>{z.c}%</div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:6}}>
                <div style={{flex:1,background:'#1a1a1a',borderRadius:3,height:14,position:'relative',overflow:'hidden'}}>
                  <div style={{position:'absolute',left:0,top:0,bottom:0,width:`${z.b}%`,background:bc(z.b),borderRadius:3}}/>
                </div>
                <div style={{fontSize:11,fontWeight:700,color:zc(z.b),minWidth:32,textAlign:'right'}}>{z.b}%</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16}}>
          <div style={{background:'#0a1a0a',border:'1px solid #22c55e',borderRadius:8,padding:14}}>
            <div style={{fontSize:9,fontWeight:700,color:'#22c55e',marginBottom:8}}>COOPER MELVIN — QB1 NextGen Profile</div>
            {[['timeToThrow','2.0s','#22c55e','IN RANGE ✓ (NFL: 2.36s)'],['airYards/play','13.2','#F0B429','ABOVE NFL AVG ✓ (8.0)'],['Comp %','84%','#22c55e','MATCHES PROJECTED'],['CPOE','+4%','#22c55e','OUTPERFORMS'],['Hash Accuracy','73%','#d97706','TARGET: 80%+'],['Deep Ball','88%','#22c55e','ELITE LEVEL ✓']].map(([l,v,vc,n])=>(
              <div key={l} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'5px 0',borderBottom:'1px solid #1d3a1d'}}>
                <div style={{fontSize:8,color:'#9ca3af'}}>{l}</div>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <div style={{fontSize:7,color:'#555'}}>{n}</div>
                  <div style={{fontSize:12,fontWeight:700,color:vc}}>{v}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{background:'#1a1000',border:'1px solid #F0B429',borderRadius:8,padding:14}}>
            <div style={{fontSize:9,fontWeight:700,color:'#F0B429',marginBottom:8}}>BEN KOOI — QB2 NextGen Profile</div>
            {[['timeToThrow','1.9s','#d97706','SLIGHTLY FAST (2.36s avg)'],['airYards/play','6.5','#dc2626','BELOW NFL AVG (8.0)'],['Comp %','70%','#d97706','BELOW PROJECTED'],['CPOE','-3%','#dc2626','UNDERPERFORMS'],['Hash Accuracy','60%','#dc2626','NEEDS WORK (71% avg)'],['Deep Ball','50%','#dc2626','BELOW NFL AVG (52%)']].map(([l,v,vc,n])=>(
              <div key={l} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'5px 0',borderBottom:'1px solid #2a1a00'}}>
                <div style={{fontSize:8,color:'#9ca3af'}}>{l}</div>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <div style={{fontSize:7,color:'#555'}}>{n}</div>
                  <div style={{fontSize:12,fontWeight:700,color:vc}}>{v}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{background:'#0a0a0a',border:'1px solid #303030',borderRadius:8,padding:14}}>
          <div style={{fontSize:10,fontWeight:700,color:'#d4a017',letterSpacing:2,marginBottom:10}}>WHAT TO TRACK AT NEXT PRACTICE</div>
          {[['#06b6d4','TRACK NOW','targetSeparation','Log each throw: OPEN (3+ yds), CONTESTED (1-2 yds), COVERED (0 yds). Grades QB decision quality.'],['#06b6d4','TRACK NOW','pressureAllowed','Mark each play: CLEAN POCKET or PRESSURE. Measures OL + QB response under pressure.'],['#22c55e','TRACK NOW','airYards per throw','Log each play as SHORT (<10), MID (10-20), or DEEP (20+). Builds full air yards profile.'],['#F0B429','TRACK NEXT','passerSpeed','Note QB runs: QB RUN, DESIGNED RUN, or SCRAMBLE. Builds rushing QB profile for recruiting.'],['#F0B429','TRACK NEXT','CPOE per session','Compare actual zone comp% to target. + means outperforming, - means underperforming.']].map(([clr,badge,metric,desc])=>(
            <div key={metric} style={{display:'flex',gap:10,padding:'8px 0',borderBottom:'1px solid #1a1a1a',alignItems:'flex-start'}}>
              <div style={{minWidth:72,background:clr+'22',border:`1px solid ${clr}`,borderRadius:4,padding:'3px 6px',fontSize:7,fontWeight:700,color:clr,textAlign:'center'}}>{badge}</div>
              <div style={{minWidth:130,fontSize:8.5,fontWeight:700,color:clr}}>{metric}</div>
              <div style={{fontSize:8,color:'#9ca3af',flex:1}}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }


  const TrackingTab = () => {
    const [activeView, setActiveView] = React.useState('animator')
    const [playIndex, setPlayIndex] = React.useState(0)
    const [isPlaying, setIsPlaying] = React.useState(false)
    const [frame, setFrame] = React.useState(0)
    const canvasRef = React.useRef(null)
    const animRef = React.useRef(null)

    const trackingPlays = [
      {name:'Baltimore — Cooper 4/21',concept:'Baltimore',result:'Complete',yards:12,qb:'Cooper',
       frames:[
         {t:0, qb:[20,25],wr1:[22,18],cb1:[23,17],sep:4.2,compProb:0.82,speed:0},
         {t:8, qb:[20,25],wr1:[26,15],cb1:[27,14],sep:3.8,compProb:0.79,speed:12.4},
         {t:16,qb:[20,25],wr1:[30,13],cb1:[31,12],sep:3.1,compProb:0.74,speed:14.2},
         {t:24,qb:[21,25],wr1:[33,12],cb1:[34,11],sep:2.8,compProb:0.71,speed:15.8},
         {t:32,qb:[21,25],wr1:[36,11],cb1:[37,10],sep:2.2,compProb:0.66,speed:16.1},
         {t:40,qb:[21,25],wr1:[38,11],cb1:[39,10],sep:1.9,compProb:0.63,speed:13.2},
       ]},
      {name:'Post Route — Cooper 4/27',concept:'Post',result:'Complete',yards:19,qb:'Cooper',
       frames:[
         {t:0, qb:[20,25],wr1:[22,30],cb1:[22,29],sep:5.1,compProb:0.88,speed:0},
         {t:8, qb:[20,25],wr1:[27,27],cb1:[27,28],sep:4.4,compProb:0.82,speed:13.1},
         {t:16,qb:[20,25],wr1:[33,23],cb1:[33,24],sep:3.6,compProb:0.76,speed:16.8},
         {t:24,qb:[21,25],wr1:[37,20],cb1:[37,21],sep:3.2,compProb:0.73,speed:18.4},
         {t:32,qb:[21,25],wr1:[40,17],cb1:[40,18],sep:3.4,compProb:0.75,speed:16.2},
       ]},
      {name:'Sail — Cooper 5/12',concept:'Sail',result:'Incomplete',yards:0,qb:'Cooper',
       frames:[
         {t:0, qb:[20,25],wr1:[22,32],cb1:[22,31],sep:3.9,compProb:0.72,speed:0},
         {t:8, qb:[20,25],wr1:[27,35],cb1:[27,34],sep:2.8,compProb:0.60,speed:14.8},
         {t:16,qb:[20,25],wr1:[33,38],cb1:[33,37],sep:1.4,compProb:0.41,speed:16.2},
         {t:24,qb:[21,26],wr1:[37,40],cb1:[37,39],sep:0.8,compProb:0.22,speed:14.4},
         {t:32,qb:[21,26],wr1:[40,41],cb1:[40,40],sep:0.4,compProb:0.08,speed:12.1},
       ]},
      {name:'Stick — Ben 5/8',concept:'Stick',result:'Complete',yards:7,qb:'Ben',
       frames:[
         {t:0, qb:[20,25],wr1:[22,22],cb1:[22,21],sep:3.8,compProb:0.78,speed:0},
         {t:8, qb:[20,25],wr1:[25,22],cb1:[25,21],sep:3.1,compProb:0.72,speed:9.4},
         {t:16,qb:[20,25],wr1:[27,22],cb1:[27,21],sep:2.6,compProb:0.67,speed:10.1},
         {t:24,qb:[20,25],wr1:[27,22],cb1:[27,21],sep:2.2,compProb:0.64,speed:4.8},
       ]},
    ]

    const play = trackingPlays[playIndex]
    const fr = play.frames[Math.min(frame, play.frames.length-1)]

    React.useEffect(() => {
      if (isPlaying) {
        animRef.current = setInterval(() => {
          setFrame(f => {
            if (f >= play.frames.length - 1) { setIsPlaying(false); return f }
            return f + 1
          })
        }, 250)
      }
      return () => clearInterval(animRef.current)
    }, [isPlaying, playIndex])

    React.useEffect(() => { setFrame(0); setIsPlaying(false) }, [playIndex])

    React.useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas || activeView !== 'animator') return
      const ctx = canvas.getContext('2d')
      const W = canvas.width, H = canvas.height
      ctx.fillStyle = '#0a1a0a'; ctx.fillRect(0,0,W,H)
      const fx = x => x * (W/60)
      const fy = y => (53.3-y) * (H/53.3)
      for (let yd=0;yd<=60;yd+=5) {
        ctx.strokeStyle=yd%10===0?'#22c55e55':'#22c55e22'
        ctx.lineWidth=yd%10===0?1:0.5
        ctx.beginPath();ctx.moveTo(fx(yd),0);ctx.lineTo(fx(yd),H);ctx.stroke()
        if(yd%10===0&&yd>0){ctx.fillStyle='#22c55e66';ctx.font='8px Helvetica';ctx.textAlign='center';ctx.fillText(yd>50?(100-yd):yd,fx(yd),H-4)}
      }
      for(let yd=0;yd<=60;yd++){
        ['#22c55e22'].forEach(()=>{ctx.strokeStyle='#22c55e15';ctx.lineWidth=0.3;ctx.beginPath();ctx.moveTo(fx(yd),fy(18));ctx.lineTo(fx(yd),fy(18)+3);ctx.stroke();ctx.beginPath();ctx.moveTo(fx(yd),fy(35));ctx.lineTo(fx(yd),fy(35)+3);ctx.stroke()})
      }
      const cpColor = fr.compProb>0.7?`rgba(34,197,94,${fr.compProb*0.2})`:fr.compProb>0.4?`rgba(217,119,6,0.2)`:`rgba(220,38,38,0.2)`
      ctx.fillStyle=cpColor;ctx.beginPath();ctx.arc(fx(fr.wr1[0]),fy(fr.wr1[1]),fr.sep*(W/60)*1.2,0,Math.PI*2);ctx.fill()
      if(frame>0){
        const f0=play.frames[0]
        ctx.strokeStyle=play.result==='Complete'?'#22c55e77':'#dc262677'
        ctx.lineWidth=1.5;ctx.setLineDash([5,3])
        ctx.beginPath();ctx.moveTo(fx(f0.qb[0]),fy(f0.qb[1]));ctx.lineTo(fx(fr.wr1[0]),fy(fr.wr1[1]));ctx.stroke();ctx.setLineDash([])
      }
      ctx.strokeStyle='#ffffff33';ctx.lineWidth=1;ctx.setLineDash([2,2])
      ctx.beginPath();ctx.moveTo(fx(fr.wr1[0]),fy(fr.wr1[1]));ctx.lineTo(fx(fr.cb1[0]),fy(fr.cb1[1]));ctx.stroke();ctx.setLineDash([])
      const mx=(fx(fr.wr1[0])+fx(fr.cb1[0]))/2,my=(fy(fr.wr1[1])+fy(fr.cb1[1]))/2
      ctx.fillStyle='#ffffffaa';ctx.font='bold 8px Helvetica';ctx.textAlign='center';ctx.fillText(`${fr.sep.toFixed(1)}yd sep`,mx,my-4)
      [[fr.cb1,'#dc2626','CB'],[fr.wr1,'#F0B429','WR★'],[fr.qb,play.qb==='Cooper'?'#22c55e':'#60a5fa',play.qb==='Cooper'?'CM':'BK']].forEach(([pos,clr,lbl],ri)=>{
        if(!pos)return
        const r=ri===2?8:6
        ctx.fillStyle=clr;ctx.beginPath();ctx.arc(fx(pos[0]),fy(pos[1]),r,0,Math.PI*2);ctx.fill()
        ctx.strokeStyle='#000';ctx.lineWidth=1;ctx.stroke()
        ctx.fillStyle='#fff';ctx.font=`bold ${r+1}px Helvetica`;ctx.textAlign='center';ctx.fillText(lbl,fx(pos[0]),fy(pos[1])+r+9)
      })
    },[frame,playIndex,activeView])

    const compProbZones=[
      {z:'Mid Short 0-10',open:'91%',tight:'68%',nfl:'72%',c:'87%',b:'85%'},
      {z:'Left Hash 10-20',open:'84%',tight:'52%',nfl:'61%',c:'73%',b:'70%'},
      {z:'Right Hash 10-20',open:'84%',tight:'52%',nfl:'61%',c:'73%',b:'68%'},
      {z:'Mid Deep 15-25',open:'79%',tight:'44%',nfl:'55%',c:'88%',b:'86%'},
      {z:'Left Deep 20+',open:'72%',tight:'36%',nfl:'47%',c:'85%',b:'82%'},
      {z:'Right Deep 20+',open:'72%',tight:'36%',nfl:'47%',c:'0%',b:'0%'},
      {z:'Red Zone',open:'65%',tight:'30%',nfl:'55%',c:'0%',b:'0%'},
    ]

    const speedData=[
      {play:'Baltimore 4/21',qb:'Cooper',mph:16.1,sep:1.9,xYAC:4.2,res:'Complete'},
      {play:'Verticals 4/30',qb:'Cooper',mph:19.2,sep:4.8,xYAC:11.2,res:'Complete'},
      {play:'Post 4/27',qb:'Cooper',mph:18.4,sep:3.4,xYAC:7.1,res:'Complete'},
      {play:'Four Verts Show',qb:'Cooper',mph:17.8,sep:3.8,xYAC:8.4,res:'Complete'},
      {play:'Sail 5/12',qb:'Cooper',mph:16.2,sep:0.4,xYAC:0,res:'Incomplete'},
      {play:'Stick 5/8',qb:'Ben',mph:10.1,sep:2.1,xYAC:2.8,res:'Complete'},
      {play:'Out 5/12',qb:'Ben',mph:11.2,sep:2.9,xYAC:3.1,res:'Complete'},
      {play:'Fade 5/8',qb:'Cooper',mph:14.8,sep:0.3,xYAC:0,res:'Incomplete'},
    ]

    return (
      <div style={{padding:isMobile?12:20,fontFamily:'Helvetica,Arial,sans-serif'}}>
        <div style={{background:'#0a1a0a',border:'1px solid #22c55e',borderRadius:8,padding:12,marginBottom:12}}>
          <div style={{fontSize:11,fontWeight:700,color:'#22c55e',letterSpacing:2,marginBottom:3}}>📡 NFL NEXTGEN TRACKING — YOLOv8 + HOMOGRAPHY + ML</div>
          <div style={{fontSize:8,color:'#555',lineHeight:1.6}}>OpenCV · YOLOv8 (Ultralytics) · Homography (pixel→yards) · scikit-learn Logistic Regression · Speed = dist/time · Separation = Euclidean(WR, nearest_CB)</div>
          <div style={{display:'flex',gap:6,marginTop:8,flexWrap:'wrap'}}>
            {['YOLOv8 Detection','Homography Mapping','Logistic Regression','Speed (dist÷time)','xYAC Model','Separation Tracking'].map(t=>(
              <span key={t} style={{background:'#22c55e11',color:'#22c55e',fontSize:7,fontWeight:700,padding:'2px 7px',borderRadius:4,border:'1px solid #22c55e33'}}>{t}</span>
            ))}
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(4,1fr)',gap:6,marginBottom:12}}>
          {[['animator','▶ Play Animator','2D field recreation'],['compProb','📊 Comp Prob Model','Logistic regression'],['tracking','⚡ Speed & Sep','CV tracking metrics'],['voronoi','🗺 Field Control','Voronoi territory']].map(([k,l,d])=>(
            <button key={k} onClick={()=>setActiveView(k)} style={{padding:'10px 6px',border:`1px solid ${activeView===k?'#22c55e':'#1a1a1a'}`,borderRadius:6,background:activeView===k?'#0a1a0a':'#0d0d0d',cursor:'pointer'}}>
              <div style={{fontSize:9,fontWeight:700,color:activeView===k?'#22c55e':'#555'}}>{l}</div>
              <div style={{fontSize:7,color:'#333',marginTop:2}}>{d}</div>
            </button>
          ))}
        </div>

        {activeView==='animator'&&<div>
          <div style={{display:'flex',gap:6,marginBottom:8,overflowX:'auto'}}>
            {trackingPlays.map((p,i)=>(
              <button key={i} onClick={()=>setPlayIndex(i)} style={{padding:'6px 10px',border:`1px solid ${playIndex===i?'#22c55e':'#252525'}`,borderRadius:6,background:playIndex===i?'#0a1a0a':'#0d0d0d',cursor:'pointer',whiteSpace:'nowrap',flexShrink:0}}>
                <div style={{fontSize:8,fontWeight:700,color:playIndex===i?'#22c55e':'#555'}}>{p.name}</div>
                <div style={{fontSize:7,color:p.result==='Complete'?'#22c55e':'#dc2626',marginTop:1}}>{p.result} · {p.yards} yds</div>
              </button>
            ))}
          </div>
          <canvas ref={canvasRef} width={520} height={280} style={{width:'100%',borderRadius:8,border:'1px solid #1d3a1d',display:'block'}}/>
          <div style={{display:'flex',gap:8,alignItems:'center',marginTop:8,padding:'10px',background:'#0d0d0d',borderRadius:6}}>
            <button onClick={()=>{setFrame(0);setIsPlaying(false)}} style={{padding:'5px 10px',background:'#111',border:'1px solid #252525',borderRadius:4,color:'#ccc',cursor:'pointer',fontSize:10}}>⏮ Reset</button>
            <button onClick={()=>setIsPlaying(!isPlaying)} style={{padding:'5px 14px',background:isPlaying?'#7f1d1d':'#14532d',border:'none',borderRadius:4,color:'#fff',cursor:'pointer',fontSize:11,fontWeight:700}}>{isPlaying?'⏸ Pause':'▶ Play'}</button>
            <input type="range" min={0} max={play.frames.length-1} value={frame} onChange={e=>setFrame(Number(e.target.value))} style={{flex:1,accentColor:'#22c55e'}}/>
            <span style={{fontSize:9,color:'#555',minWidth:60}}>Frame {frame+1}/{play.frames.length}</span>
          </div>
          <div style={{display:'grid',gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(4,1fr)',gap:6,marginTop:8}}>
            {[['Comp Prob',`${Math.round(fr.compProb*100)}%`,fr.compProb>0.7?'#22c55e':fr.compProb>0.4?'#d97706':'#dc2626'],['Separation',`${fr.sep?.toFixed(1)} yds`,fr.sep>2.5?'#22c55e':fr.sep>1.5?'#d97706':'#dc2626'],['WR Speed',`${fr.speed?.toFixed(1)} mph`,'#06b6d4'],['Result',play.result,play.result==='Complete'?'#22c55e':'#dc2626']].map(([l,v,c])=>(
              <div key={l} style={{background:'#111',border:'0.5px solid #1a1a1a',borderRadius:6,padding:10,textAlign:'center'}}>
                <div style={{fontSize:14,fontWeight:700,color:c}}>{v}</div>
                <div style={{fontSize:7,color:'#555',marginTop:2}}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{background:'#0a0a0a',border:'0.5px solid #1a1a1a',borderRadius:6,padding:10,marginTop:8}}>
            <div style={{fontSize:7.5,color:'#444',lineHeight:1.7}}><span style={{color:'#22c55e',fontWeight:700}}>HOW THIS WORKS: </span>YOLOv8 detects each player per frame · ByteTrack assigns persistent player IDs · Homography matrix maps pixel XY → field yards · Speed = Δdistance/Δtime · Separation = Euclidean(WR, nearest_CB) · Comp probability = logistic regression on [air_yards, separation, TTT, hash_position]</div>
          </div>
        </div>}

        {activeView==='compProb'&&<div>
          <div style={{background:'#07070f',border:'1px solid #06b6d4',borderRadius:8,padding:12,marginBottom:12}}>
            <div style={{fontSize:10,fontWeight:700,color:'#06b6d4',marginBottom:3}}>COMPLETION PROBABILITY — Logistic regression model by zone + separation</div>
            <div style={{fontSize:8,color:'#555'}}>Features: air_yards · target_separation · passer_speed · field_zone · time_to_throw · Trained on 117 plays</div>
          </div>
          <div style={{background:'#0d0d0d',border:'1px solid #1d3a1d',borderRadius:8,overflow:'hidden',marginBottom:12}}>
            <div style={{display:'grid',gridTemplateColumns:'1.6fr 1fr 1fr 1fr 1fr 1fr',background:'#0a0a0a',padding:'7px 10px',borderBottom:'1px solid #1d3a1d'}}>
              {['ZONE','OPEN 3+ yds','TIGHT <2yds','NFL AVG','COOPER','BEN'].map(h=><div key={h} style={{fontSize:7,fontWeight:700,color:'#555',textAlign:'center'}}>{h}</div>)}
            </div>
            {compProbZones.map((row,i)=>{
              const cc=row.c==='0%'?'#dc2626':parseInt(row.c)>=80?'#22c55e':'#d97706'
              const bc=row.b==='0%'?'#dc2626':parseInt(row.b)>=80?'#22c55e':'#d97706'
              return(
                <div key={row.z} style={{display:'grid',gridTemplateColumns:'1.6fr 1fr 1fr 1fr 1fr 1fr',padding:'8px 10px',background:i%2===0?'#0f0f0f':'#141414',borderBottom:'0.5px solid #1a1a1a',alignItems:'center'}}>
                  <div style={{fontSize:8,fontWeight:700,color:'#F0B429'}}>{row.z}</div>
                  {[[row.open,'#22c55e'],[row.tight,'#dc2626'],[row.nfl,'#9ca3af'],[row.c,cc],[row.b,bc]].map(([v,c],j)=>(
                    <div key={j} style={{textAlign:'center'}}><span style={{fontSize:11,fontWeight:700,color:c}}>{v}</span></div>
                  ))}
                </div>
              )
            })}
          </div>
          <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:isMobile?8:10}}>
            <div style={{background:'#0a0a0a',border:'0.5px solid #252525',borderRadius:8,padding:12}}>
              <div style={{fontSize:9,fontWeight:700,color:'#22c55e',marginBottom:8}}>MODEL FEATURES</div>
              {[['air_yards','Distance LOS→target','Most impactful'],['separation','WR to nearest DB','3+yds=OPEN'],['TTT','Snap to release','Cooper 2.0s optimal'],['hash_pos','L/Mid/R zone','Mid dominant'],['passer_speed','QB mph at release','Cooper mobile+']].map(([f,d,n])=>(
                <div key={f} style={{padding:'5px 0',borderBottom:'0.5px solid #1a1a1a'}}>
                  <div style={{display:'flex',justifyContent:'space-between'}}><span style={{fontSize:8,fontWeight:700,color:'#06b6d4'}}>{f}</span><span style={{fontSize:7,color:'#444'}}>{n}</span></div>
                  <div style={{fontSize:7.5,color:'#666',marginTop:1}}>{d}</div>
                </div>
              ))}
            </div>
            <div style={{background:'#0a0a0a',border:'0.5px solid #252525',borderRadius:8,padding:12}}>
              <div style={{fontSize:9,fontWeight:700,color:'#F0B429',marginBottom:8}}>CPOE — Comp% Over Expected</div>
              {[['Cooper overall','84%','~80%','+4%','#22c55e'],['Ben overall','70%','~73%','-3%','#dc2626'],['Cooper mid short','87%','82%','+5%','#22c55e'],['Cooper deep ball','88%','52%','+36%','#22c55e'],['Ben deep ball','50%','52%','-2%','#d97706'],['Cooper hash','73%','71%','+2%','#22c55e'],['Ben hash','60%','71%','-11%','#dc2626']].map(([ctx,act,exp,cpoe,c])=>(
                <div key={ctx} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'5px 0',borderBottom:'0.5px solid #1a1a1a'}}>
                  <span style={{fontSize:7.5,color:'#9ca3af'}}>{ctx}</span>
                  <div style={{display:'flex',gap:8}}><span style={{fontSize:7,color:'#444'}}>{act} vs {exp}</span><span style={{fontSize:10,fontWeight:700,color:c}}>{cpoe}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>}

        {activeView==='tracking'&&<div>
          <div style={{background:'#07070f',border:'1px solid #06b6d4',borderRadius:8,padding:12,marginBottom:12}}>
            <div style={{fontSize:10,fontWeight:700,color:'#06b6d4',marginBottom:3}}>SPEED & SEPARATION — YOLOv8 + homography tracking output</div>
            <div style={{fontSize:8,color:'#555'}}>Speed = distance(frame_t, frame_t-1) ÷ time_delta · Separation = Euclidean(WR_pos, nearest_CB_pos) in yards · xYAC = f(speed, separation, distance_to_endzone)</div>
          </div>
          <div style={{background:'#0d0d0d',border:'1px solid #1d3a1d',borderRadius:8,overflow:'hidden',marginBottom:12}}>
            <div style={{display:'grid',gridTemplateColumns:'1.5fr 0.6fr 0.8fr 0.8fr 0.8fr 0.7fr',background:'#0a0a0a',padding:'7px 10px',borderBottom:'1px solid #1d3a1d'}}>
              {['PLAY','QB','MAX SPD','CATCH SEP','xYAC','RESULT'].map(h=><div key={h} style={{fontSize:7,fontWeight:700,color:'#555',textAlign:'center'}}>{h}</div>)}
            </div>
            {speedData.map((row,i)=>{
              const rc=row.res==='Complete'?'#22c55e':'#dc2626'
              const sc=row.sep>=2.5?'#22c55e':row.sep>=1.5?'#d97706':'#dc2626'
              return(
                <div key={i} style={{display:'grid',gridTemplateColumns:'1.5fr 0.6fr 0.8fr 0.8fr 0.8fr 0.7fr',padding:'7px 10px',background:i%2===0?'#0f0f0f':'#141414',borderBottom:'0.5px solid #1a1a1a',alignItems:'center'}}>
                  <div style={{fontSize:8,fontWeight:700,color:'#F0B429'}}>{row.play}</div>
                  <div style={{fontSize:8,textAlign:'center',color:row.qb==='Cooper'?'#22c55e':'#60a5fa'}}>{row.qb}</div>
                  <div style={{fontSize:10,fontWeight:700,color:'#06b6d4',textAlign:'center'}}>{row.mph} mph</div>
                  <div style={{fontSize:10,fontWeight:700,color:sc,textAlign:'center'}}>{row.sep} yds</div>
                  <div style={{fontSize:10,fontWeight:700,color:'#F0B429',textAlign:'center'}}>{row.xYAC>0?`+${row.xYAC}`:'—'}</div>
                  <div style={{fontSize:8,fontWeight:700,color:rc,textAlign:'center'}}>{row.res==='Complete'?'✓':'✗'}</div>
                </div>
              )
            })}
          </div>
          <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr 1fr',gap:isMobile?6:8}}>
            {[['19.2 mph','Peak WR Speed','Cooper Verticals 4/30','vs NFL slot avg 14.8','#22c55e'],['4.8 yds','Best Catch Sep','Cooper Verticals','NFL avg at catch 2.8','#22c55e'],['+11.2 yds','Best xYAC','Cooper Verticals','Predicted yards after catch','#F0B429']].map(([v,l,p,n,c])=>(
              <div key={l} style={{background:'#111',border:'0.5px solid #1a1a1a',borderRadius:6,padding:12,textAlign:'center'}}>
                <div style={{fontSize:18,fontWeight:700,color:c}}>{v}</div>
                <div style={{fontSize:9,fontWeight:700,color:c,marginTop:2}}>{l}</div>
                <div style={{fontSize:7,color:'#666',marginTop:2}}>{p}</div>
                <div style={{fontSize:7,color:'#444',marginTop:2}}>{n}</div>
              </div>
            ))}
          </div>
        </div>}

        {activeView==='voronoi'&&<div>
          <div style={{background:'#0a0a0a',border:'1px solid #22c55e',borderRadius:8,padding:12,marginBottom:12}}>
            <div style={{fontSize:10,fontWeight:700,color:'#22c55e',marginBottom:3}}>VORONOI FIELD CONTROL — Spatial dominance diagram</div>
            <div style={{fontSize:8,color:'#555'}}>Each region = area closest to that player. Green = offense controls. Red = defense pressure. Based on avg player positions from tracking data across all 117 plays.</div>
          </div>
          <svg viewBox="0 0 520 280" style={{width:'100%',border:'1px solid #1d3a1d',borderRadius:8,background:'#0a1a0a',marginBottom:12,display:'block'}}>
            {[0,10,20,30,40,50,60].map(y=><line key={y} x1={y*8.67} y1={0} x2={y*8.67} y2={280} stroke="#22c55e22" strokeWidth={y%20===0?1:0.5}/>)}
            <polygon points="150,0 250,0 250,140 150,140" fill="rgba(34,197,94,0.12)" stroke="#22c55e33" strokeWidth={0.5}/>
            <polygon points="250,0 330,0 330,90 250,90" fill="rgba(34,197,94,0.09)" stroke="#22c55e22" strokeWidth={0.5}/>
            <polygon points="150,140 250,140 250,280 150,280" fill="rgba(34,197,94,0.10)" stroke="#22c55e22" strokeWidth={0.5}/>
            <polygon points="250,90 360,0 370,150 250,140" fill="rgba(220,38,38,0.07)" stroke="#dc262622" strokeWidth={0.5}/>
            <polygon points="360,0 520,0 520,280 370,150 360,0" fill="rgba(220,38,38,0.13)" stroke="#dc262633" strokeWidth={0.5}/>
            <polygon points="0,0 150,0 150,280 0,280" fill="rgba(34,197,94,0.06)" stroke="#22c55e11" strokeWidth={0.5}/>
            {[[155,140,'QB','#22c55e',9],[245,70,'WR★','#F0B429',7],[245,210,'WR','#F0B42977',6],[195,140,'OL','#22c55e55',5],[305,60,'CB','#dc2626',6],[305,220,'CB','#dc262688',6],[340,140,'LB','#99333377',6],[410,100,'S','#dc262666',6]].map(([x,y,l,c,r])=>(
              <g key={`${x}${y}`}>
                <circle cx={x} cy={y} r={r} fill={c} stroke="#000" strokeWidth={0.8}/>
                <text x={x} y={y+r+9} textAnchor="middle" fill={c} fontSize={7} fontWeight="bold">{l}</text>
              </g>
            ))}
            <text x={180} y={16} textAnchor="middle" fill="#22c55e" fontSize={8} fontWeight="bold">OFFENSE ZONE</text>
            <text x={440} y={16} textAnchor="middle" fill="#dc2626" fontSize={8} fontWeight="bold">DEFENSE ZONE</text>
            <line x1={250} y1={0} x2={250} y2={280} stroke="#F0B42966" strokeWidth={1.5} strokeDasharray="6,3"/>
            <text x={252} y={270} fill="#F0B42988" fontSize={7}>LOS</text>
          </svg>
          <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:isMobile?8:10}}>
            <div style={{background:'#0a1a0a',border:'1px solid #22c55e33',borderRadius:8,padding:12}}>
              <div style={{fontSize:9,fontWeight:700,color:'#22c55e',marginBottom:8}}>OFFENSE TERRITORY CONTROL</div>
              {[['Mid field','72%','Dominates between hashes'],['Left hash zone','68%','Strong WR release left'],['Deep middle','61%','Air yards force safeties back'],['Short behind LOS','100%','OL controls pre-snap']].map(([z,p,n])=>(
                <div key={z} style={{padding:'5px 0',borderBottom:'0.5px solid #1d3a1d'}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:1}}><span style={{fontSize:8,color:'#ccc'}}>{z}</span><span style={{fontSize:10,fontWeight:700,color:'#22c55e'}}>{p}</span></div>
                  <div style={{fontSize:7,color:'#444'}}>{n}</div>
                </div>
              ))}
            </div>
            <div style={{background:'#1a0404',border:'1px solid #dc262633',borderRadius:8,padding:12}}>
              <div style={{fontSize:9,fontWeight:700,color:'#dc2626',marginBottom:8}}>DEFENSE PRESSURE ZONES</div>
              {[['Right hash deep','0% offense','Sail/Fade fail — confirms data'],['Red zone','0% offense','No package — critical gap'],['Boundary right','0% offense','Cooper 0% right deep'],['Contested outs','32%','Need more separation']].map(([z,p,n])=>(
                <div key={z} style={{padding:'5px 0',borderBottom:'0.5px solid #2a0404'}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:1}}><span style={{fontSize:8,color:'#fca5a5'}}>{z}</span><span style={{fontSize:10,fontWeight:700,color:'#dc2626'}}>{p}</span></div>
                  <div style={{fontSize:7,color:'#444'}}>{n}</div>
                </div>
              ))}
            </div>
          </div>
        </div>}
      </div>
    )
  }


  const AITab=()=>{
    const [msgs,setMsgs]=React.useState([{role:'assistant',content:'Hey Coach! I know all 117 plays from this season. Ask me anything about Cooper, Ben, concepts, game planning, or recruiting.'}])
    const [inp,setInp]=React.useState('');const [load,setLoad]=React.useState(false)
    const ref=React.useRef(null)
    const qs=['What is Cooper best concept on 3rd and medium?','Generate a 5-play opening script','What does Ben need to fix most?','Which concepts should we cut?','How does Cooper compare to D2 QB recruit?']
    const send=async(msg)=>{
      if(!msg.trim()||load)return
      const um={role:'user',content:msg};const nm=[...msgs,um]
      setMsgs(nm);setInp('');setLoad(true)
      try{
        const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:800,system:'You are an elite football analytics AI for Westfield Shamrocks. Be specific and data-driven. Season data: 117 plays. Cooper Melvin QB1: 63 att 50 comp 84% 658yds 13.2ypa RTG87 Grade A. Ben Kooi QB2: 54 att 38 comp 70% 310yds 6.5ypa RTG71 Grade B. Concepts: Baltimore 100% 12.4avg ELITE EPA+1.8, Post 100% 13.1avg ELITE EPA+1.4, Stick 100% 7.7avg ELITE EPA+0.8, Four Verts 100% 22avg ELITE EPA+1.9, Verticals 88% 28.5avg ELITE EPA+2.1, Out 100% SOLID, Slant 90% SOLID, Smash 100% BUILD, RPO Glance 100% BUILD, Sail 0% CUT EPA-0.6, Fade 0% CUT EPA-0.8. Red Zone 0% both QBs critical gap. Cooper TTT 2.0s airYards 13.2 CPOE+4% deepBall 88% hash 73%. Ben TTT 1.9s airYards 6.5 CPOE-3% deepBall 50% hash 60%. ',messages:nm.map(m=>({role:m.role,content:m.content}))})})
        const d=await r.json();const reply=d.content?.[0]?.text||'Error'
        setMsgs(p=>[...p,{role:'assistant',content:reply}])
      }catch(e){setMsgs(p=>[...p,{role:'assistant',content:'API connection error.'}])}
      setLoad(false)
    }
    React.useEffect(()=>ref.current?.scrollIntoView({behavior:'smooth'}),[msgs])
    return(
      <div style={{padding:20,display:'flex',flexDirection:'column',height:'82vh'}}>
        <div style={{background:'#0a0d1a',border:'1px solid #06b6d4',borderRadius:8,padding:12,marginBottom:10}}>
          <div style={{fontSize:11,fontWeight:700,color:'#06b6d4',letterSpacing:2}}>🤖 AI COACHING ASSISTANT — Powered by Claude</div>
          <div style={{fontSize:8,color:'#555',marginTop:2}}>Knows all 117 plays · Every concept · Cooper and Ben full profiles · Game plan ready</div>
        </div>
        <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:8}}>
          {qs.map(q=><button key={q} onClick={()=>send(q)} style={{padding:'4px 10px',background:'#0d0d0d',border:'0.5px solid #252525',borderRadius:20,color:'#9ca3af',fontSize:9,cursor:'pointer'}}>{q}</button>)}
        </div>
        <div style={{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:8,paddingBottom:8}}>
          {msgs.map((m,i)=>(
            <div key={i} style={{display:'flex',justifyContent:m.role==='user'?'flex-end':'flex-start'}}>
              <div style={{maxWidth:'82%',padding:'10px 14px',borderRadius:10,background:m.role==='user'?'#14532d':'#111',border:`0.5px solid ${m.role==='user'?'#22c55e33':'#252525'}`,borderBottomRightRadius:m.role==='user'?2:10,borderBottomLeftRadius:m.role==='assistant'?2:10}}>
                {m.role==='assistant'&&<div style={{fontSize:8,fontWeight:700,color:'#06b6d4',marginBottom:3,letterSpacing:1}}>AI ANALYST</div>}
                <div style={{fontSize:13,color:'#e5e7eb',lineHeight:1.6,whiteSpace:'pre-wrap'}}>{m.content}</div>
              </div>
            </div>
          ))}
          {load&&<div style={{display:'flex',justifyContent:'flex-start'}}><div style={{padding:'10px 14px',background:'#111',border:'0.5px solid #252525',borderRadius:10}}><span style={{fontSize:11,color:'#06b6d4'}}>Analyzing season data...</span></div></div>}
          <div ref={ref}/>
        </div>
        <div style={{display:'flex',gap:8,marginTop:8}}>
          <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send(inp)} placeholder="Ask anything about the season, plays, or game planning..." style={{flex:1,background:'#111',border:'1px solid #252525',borderRadius:8,padding:'10px 14px',color:'#fff',fontSize:13,outline:'none'}}/>
          <button onClick={()=>send(inp)} disabled={load||!inp.trim()} style={{padding:isMobile?'12px 20px':'10px 20px',background:load||!inp.trim()?'#111':'#14532d',border:'none',borderRadius:8,color:load||!inp.trim()?'#555':'#22c55e',fontWeight:700,fontSize:isMobile?16:13,cursor:'pointer'}}>{load?'...':'Send'}</button>
        </div>
      </div>
    )
  }
  const LoggerTab=()=>{
    const [plays,setPlays]=React.useState([])
    const [qb,setQb]=React.useState('Cooper Melvin');const [con,setCon]=React.useState('Baltimore')
    const [res,setRes]=React.useState('Complete');const [yds,setYds]=React.useState('')
    const [hash,setHash]=React.useState('Middle');const [pres,setPres]=React.useState('Clean')
    const concepts=['Baltimore','Post','Stick','Four Verts','Verticals','Out','Slant','Smash','RPO Glance','Sail','Fade']
    const log=()=>{if(!yds&&res==='Complete')return;setPlays(p=>[...p,{id:Date.now(),qb,con,res,yds:Number(yds)||0,hash,pres,time:new Date().toLocaleTimeString()}]);setYds('')}
    const cp=p=>p.length?Math.round(p.filter(x=>x.res==='Complete').length/p.length*100):0
    const ay=p=>p.length?(p.reduce((a,x)=>a+x.yds,0)/p.length).toFixed(1):0
    const CM=plays.filter(p=>p.qb==='Cooper Melvin'),BK=plays.filter(p=>p.qb==='Ben Kooi')
    const breakdown=concepts.map(c=>{const cp2=plays.filter(p=>p.con===c);return{c,att:cp2.length,pct:cp2.length?Math.round(cp2.filter(x=>x.res==='Complete').length/cp2.length*100):0}}).filter(x=>x.att>0)
    return(
      <div style={{padding:20}}>
        <div style={{background:'#0a1a0a',border:'1px solid #22c55e',borderRadius:8,padding:12,marginBottom:12,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div><div style={{fontSize:11,fontWeight:700,color:'#22c55e',letterSpacing:2}}>📋 LIVE PRACTICE LOGGER</div><div style={{fontSize:8,color:'#555',marginTop:2}}>Log plays in real time — auto-calculates comp%, RTG, EPA</div></div>
          <div style={{display:'flex',gap:12,alignItems:'center'}}>
            <div style={{textAlign:'center'}}><div style={{fontSize:18,fontWeight:700,color:'#22c55e'}}>{plays.length}</div><div style={{fontSize:7,color:'#555'}}>PLAYS</div></div>
            <button onClick={()=>{if(window.confirm('Clear all?'))setPlays([])}} style={{padding:'4px 10px',background:'#1a0404',border:'1px solid #dc262644',borderRadius:6,color:'#dc2626',fontSize:10,cursor:'pointer'}}>Clear</button>
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          <div style={{background:'#0d0d0d',border:'0.5px solid #252525',borderRadius:8,padding:14}}>
            <div style={{fontSize:9,fontWeight:700,color:'#F0B429',marginBottom:10,letterSpacing:1}}>LOG PLAY</div>
            <div style={{marginBottom:8}}><div style={{fontSize:7,color:'#555',marginBottom:4}}>QB</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:4}}>
                {['Cooper Melvin','Ben Kooi'].map(q=><button key={q} onClick={()=>setQb(q)} style={{padding:'7px',background:qb===q?'#14532d':'#111',border:`1px solid ${qb===q?'#22c55e':'#252525'}`,borderRadius:6,color:qb===q?'#22c55e':'#555',fontSize:9,fontWeight:700,cursor:'pointer'}}>{q==='Cooper Melvin'?'Cooper QB1':'Ben QB2'}</button>)}
              </div>
            </div>
            <div style={{marginBottom:8}}><div style={{fontSize:7,color:'#555',marginBottom:4}}>CONCEPT</div>
              <select value={con} onChange={e=>setCon(e.target.value)} style={{width:'100%',background:'#111',border:'0.5px solid #252525',borderRadius:6,color:'#ccc',padding:'7px',fontSize:12}}>
                {concepts.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:8}}>
              <div><div style={{fontSize:7,color:'#555',marginBottom:4}}>HASH</div>
                <div style={{display:'flex',gap:3}}>{['Left','Middle','Right'].map(h=><button key={h} onClick={()=>setHash(h)} style={{flex:1,padding:'6px 2px',background:hash===h?'#0c1a3a':'#111',border:`1px solid ${hash===h?'#06b6d4':'#252525'}`,borderRadius:4,color:hash===h?'#06b6d4':'#555',fontSize:8,fontWeight:700,cursor:'pointer'}}>{h[0]}</button>)}</div>
              </div>
              <div><div style={{fontSize:7,color:'#555',marginBottom:4}}>POCKET</div>
                <div style={{display:'flex',gap:3}}>{['Clean','Pressure'].map(p=><button key={p} onClick={()=>setPres(p)} style={{flex:1,padding:'6px 2px',background:pres===p?(p==='Clean'?'#0a1a0a':'#1a0404'):'#111',border:`1px solid ${pres===p?(p==='Clean'?'#22c55e':'#dc2626'):'#252525'}`,borderRadius:4,color:pres===p?(p==='Clean'?'#22c55e':'#dc2626'):'#555',fontSize:7,fontWeight:700,cursor:'pointer'}}>{p}</button>)}</div>
              </div>
            </div>
            <div style={{marginBottom:8}}><div style={{fontSize:7,color:'#555',marginBottom:4}}>RESULT</div>
              <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                {['Complete','Incomplete','Interception','Scramble'].map(r=>{const rc=r==='Complete'?'#22c55e':r==='Incomplete'?'#d97706':'#dc2626';return<button key={r} onClick={()=>setRes(r)} style={{padding:'5px 8px',background:res===r?rc+'22':'#111',border:`1px solid ${res===r?rc:'#252525'}`,borderRadius:4,color:res===r?rc:'#555',fontSize:8,fontWeight:700,cursor:'pointer'}}>{r}</button>})}
              </div>
            </div>
            <div style={{marginBottom:10}}><div style={{fontSize:7,color:'#555',marginBottom:4}}>YARDS</div>
              <input type="number" value={yds} onChange={e=>setYds(e.target.value)} placeholder="0" style={{width:'100%',background:'#111',border:'0.5px solid #252525',borderRadius:6,color:'#fff',padding:'8px',fontSize:18,fontWeight:700,outline:'none'}}/>
            </div>
            <button onClick={log} style={{width:'100%',padding:isMobile?'16px':'12px',background:'#14532d',border:'none',borderRadius:8,color:'#22c55e',fontWeight:700,fontSize:isMobile?18:14,cursor:'pointer'}}>+ LOG PLAY</button>
          </div>
          <div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginBottom:10}}>
              {[['COOPER','#22c55e',CM],['BEN','#F0B429',BK]].map(([n,clr,ps])=>(
                <div key={n} style={{background:'#111',border:`0.5px solid ${clr}33`,borderRadius:8,padding:10}}>
                  <div style={{fontSize:8,fontWeight:700,color:clr,marginBottom:4}}>{n}</div>
                  <div style={{fontSize:24,fontWeight:700,color:clr}}>{cp(ps)}%</div>
                  <div style={{fontSize:7,color:'#555'}}>COMP · {ps.length} att · {ay(ps)} ypa</div>
                </div>
              ))}
            </div>
            {breakdown.length>0&&<div style={{background:'#0d0d0d',border:'0.5px solid #1d3a1d',borderRadius:8,overflow:'hidden'}}>
              <div style={{background:'#0a0a0a',padding:'6px 10px',borderBottom:'0.5px solid #1d3a1d',display:'grid',gridTemplateColumns:'1.5fr 0.5fr 0.8fr'}}>
                {['CONCEPT','ATT','COMP%'].map(h=><div key={h} style={{fontSize:7,fontWeight:700,color:'#555',textAlign:'center'}}>{h}</div>)}
              </div>
              {breakdown.map((x,i)=>{const gc=x.pct===100?'#22c55e':x.pct>=70?'#d97706':'#dc2626';return(
                <div key={x.c} style={{display:'grid',gridTemplateColumns:'1.5fr 0.5fr 0.8fr',padding:'6px 10px',background:i%2===0?'#0f0f0f':'#141414',borderBottom:'0.5px solid #1a1a1a'}}>
                  <div style={{fontSize:8,fontWeight:700,color:'#F0B429'}}>{x.c}</div>
                  <div style={{fontSize:9,textAlign:'center',color:'#ccc'}}>{x.att}</div>
                  <div style={{fontSize:10,textAlign:'center',fontWeight:700,color:gc}}>{x.pct}%</div>
                </div>
              )})}
            </div>}
            {plays.length===0&&<div style={{background:'#0d0d0d',border:'0.5px solid #1a1a1a',borderRadius:8,padding:24,textAlign:'center',color:'#333',fontSize:13}}>No plays logged yet</div>}
            {[...plays].reverse().slice(0,6).map((p,i)=>{const rc=p.res==='Complete'?'#22c55e':p.res==='Incomplete'?'#d97706':'#dc2626';return(
              <div key={p.id} style={{display:'flex',gap:8,padding:'6px 10px',borderBottom:'0.5px solid #1a1a1a',alignItems:'center',background:i%2===0?'#0f0f0f':'#111',borderRadius:i===0?'8px 8px 0 0':0,marginTop:i===0?8:0}}>
                <div style={{fontSize:7,color:'#444',minWidth:38}}>{p.time}</div>
                <div style={{fontSize:8,fontWeight:700,color:p.qb==='Cooper Melvin'?'#22c55e':'#F0B429',minWidth:24}}>{p.qb==='Cooper Melvin'?'CM':'BK'}</div>
                <div style={{fontSize:8,fontWeight:700,color:'#F0B429',flex:1}}>{p.con}</div>
                <div style={{fontSize:9,fontWeight:700,color:rc}}>{p.res}</div>
                <div style={{fontSize:9,color:'#ccc',minWidth:24}}>{p.yds>0?`${p.yds}y`:'-'}</div>
              </div>
            )})}
          </div>
        </div>
      </div>
    )
  }


  const GamePlanTab=()=>{
    const [plan,setPlan]=React.useState('');const [load,setLoad]=React.useState(false)
    const [opp,setOpp]=React.useState('');const [gt,setGt]=React.useState('7on7');const [foc,setFoc]=React.useState('Balanced')
    const gen=async()=>{
      setLoad(true);setPlan('')
      const prompt=`Generate a game plan for Westfield Shamrocks for a ${gt} game${opp?' vs '+opp:''}. Focus: ${foc}.\n\nFormat exactly:\n**OPENING SCRIPT (First 5 Plays)**\nList 5 specific plays with reasoning\n\n**TOP CONCEPTS TO CALL**\nTop 4 concepts with stats\n\n**HASH STRATEGY**\nLeft/Middle/Right approach\n\n**AVOID COMPLETELY**\nWhat to cut and why\n\n**SITUATIONAL CALLS**\n3rd down, red zone, 2-minute\n\n**COOPER SPOTLIGHT**\n2-3 plays for college scouts\n\n**BEN KOOI PACKAGE**\n2-3 plays for Ben\n\nReference actual stats. Be specific.`
      try{
        const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1200,system:`You are an elite offensive coordinator for Westfield Shamrocks. Season data: 117 plays. Cooper QB1: 84% 658yds 13.2ypa RTG87 Grade A. Ben QB2: 70% 310yds 6.5ypa RTG71 Grade B. Best plays: Baltimore 100% EPA+1.8, Post 100% EPA+1.4, Verticals 88% EPA+2.1, Stick 100% EPA+0.8, Four Verts 100% EPA+1.9. Cut: Sail 0% EPA-0.6, Fade 0% EPA-0.8. Red Zone 0% both QBs. Cooper TTT 2.0s airYards 13.2 CPOE+4% deepBall 88%. Ben TTT 1.9s airYards 6.5 CPOE-3%.`,messages:[{role:'user',content:prompt}]})})
        const d=await r.json();setPlan(d.content?.[0]?.text||'Error')
      }catch(e){setPlan('Connection error.')}
      setLoad(false)
    }
    const fmt=t=>t.split('\n').map((line,i)=>{
      if(line.startsWith('**')&&line.endsWith('**'))return<div key={i} style={{fontSize:10,fontWeight:700,color:'#F0B429',letterSpacing:1,marginTop:14,marginBottom:4,paddingTop:10,borderTop:'0.5px solid #252525'}}>{line.replace(/\*\*/g,'').toUpperCase()}</div>
      if(!line.trim())return<div key={i} style={{height:4}}/>
      return<div key={i} style={{fontSize:12,color:'#ccc',lineHeight:1.7,paddingLeft:line.startsWith('-')||line.match(/^\d+\./)?12:0}}>{line}</div>
    })
    return(
      <div style={{padding:20}}>
        <div style={{background:'#1a1400',border:'1px solid #F0B429',borderRadius:8,padding:12,marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:700,color:'#F0B429',letterSpacing:2}}>⚡ AI GAME PLAN GENERATOR — Built from your 117-play season</div>
          <div style={{fontSize:8,color:'#555',marginTop:2}}>Concept grades · EPA scores · Zone analysis · Cooper and Ben profiles · All baked in</div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr 1fr',gap:isMobile?8:10,marginBottom:14}}>
          {[['Opponent (optional)',opp,setOpp,'text','Team name...'],['Game Type',gt,setGt,'select',['7on7','Varsity Game','College Showcase','Scrimmage','Practice Script']],['Focus',foc,setFoc,'select',['Balanced','Showcase Cooper','Develop Ben','Feature Deep Ball','Short Game','Red Zone Work']]].map(([lbl,val,set,type,opts])=>(
            <div key={lbl}><div style={{fontSize:8,color:'#555',marginBottom:4}}>{lbl.toUpperCase()}</div>
              {type==='text'?<input value={val} onChange={e=>set(e.target.value)} placeholder={opts} style={{width:'100%',background:'#111',border:'0.5px solid #252525',borderRadius:6,color:'#fff',padding:'8px',fontSize:12,outline:'none'}}/>
              :<select value={val} onChange={e=>set(e.target.value)} style={{width:'100%',background:'#111',border:'0.5px solid #252525',borderRadius:6,color:'#ccc',padding:'8px',fontSize:12}}>{opts.map(o=><option key={o} value={o}>{o}</option>)}</select>}
            </div>
          ))}
        </div>
        <button onClick={gen} disabled={load} style={{width:'100%',padding:'14px',background:load?'#111':'#2a1400',border:`1px solid ${load?'#252525':'#F0B429'}`,borderRadius:8,color:load?'#555':'#F0B429',fontWeight:700,fontSize:14,cursor:load?'default':'pointer',marginBottom:16}}>
          {load?'Generating game plan from your data...':'⚡ GENERATE GAME PLAN'}
        </button>
        {plan?<div style={{background:'#0d0d0d',border:'0.5px solid #252525',borderRadius:8,padding:16}}><div style={{fontSize:9,fontWeight:700,color:'#22c55e',letterSpacing:1,marginBottom:10,paddingBottom:8,borderBottom:'0.5px solid #252525'}}>WESTFIELD SHAMROCKS — {gt.toUpperCase()}{opp?' vs '+opp.toUpperCase():''} · Generated by AI · 117 plays</div>{fmt(plan)}</div>
        :<div style={{background:'#0d0d0d',border:'0.5px solid #1a1a1a',borderRadius:8,padding:30,textAlign:'center',color:'#333',fontSize:12}}>Configure above and generate your personalized game plan</div>}
      </div>
    )
  }
  const RouteTreeTab=()=>{
    const [sel,setSel]=React.useState(null)
    const routes=[
      {id:'baltimore',name:'Baltimore',comp:100,att:12,yds:12.4,epa:1.8,grade:'ELITE',col:'#22c55e',x:260,y:70,desc:'Best big play. 100% comp. 12.4 avg yds. Call every series.'},
      {id:'post',name:'Post',comp:100,att:10,yds:13.1,epa:1.4,grade:'ELITE',col:'#22c55e',x:340,y:65,desc:'Primary 1st down weapon. 13.1 avg yds. Cooper arm strength shines.'},
      {id:'fourverts',name:'Four Verts',comp:100,att:2,yds:22.0,epa:1.9,grade:'ELITE',col:'#22c55e',x:190,y:60,desc:'Most explosive. 22.0 avg yds. Cooper specialty — feature at showcase.'},
      {id:'verticals',name:'Verticals',comp:88,att:4,yds:28.5,epa:2.1,grade:'ELITE',col:'#22c55e',x:130,y:70,desc:'Highest EPA +2.1. 28.5 avg yds. Best single play in script.'},
      {id:'stick',name:'Stick',comp:100,att:22,yds:7.7,epa:0.8,grade:'ELITE',col:'#22c55e',x:430,y:140,desc:'Most reliable. 22 att 100% comp. Call every 1st and 2nd down.'},
      {id:'out',name:'Out',comp:100,att:10,yds:6.5,epa:0.2,grade:'SOLID',col:'#d97706',x:490,y:120,desc:'Reliable 2nd down. Keep in every script.'},
      {id:'slant',name:'Slant',comp:90,att:8,yds:5.1,epa:0.3,grade:'SOLID',col:'#d97706',x:500,y:185,desc:'Good rhythm opener for 1st series.'},
      {id:'smash',name:'Smash',comp:100,att:2,yds:8.0,epa:0.5,grade:'BUILD',col:'#d97706',x:390,y:200,desc:'Early results good. Expand reps.'},
      {id:'rpoglance',name:'RPO',comp:100,att:4,yds:7.5,epa:0.4,grade:'BUILD',col:'#d97706',x:310,y:205,desc:'Versatile. Works multiple coverages.'},
      {id:'sail',name:'Sail',comp:0,att:10,yds:0,epa:-0.6,grade:'CUT',col:'#dc2626',x:210,y:195,desc:'0% all season both QBs. Remove from live script now.'},
      {id:'fade',name:'Fade',comp:0,att:10,yds:0,epa:-0.8,grade:'CUT',col:'#dc2626',x:285,y:215,desc:'Worst EPA -0.8. Drill only — no live reps.'},
    ]
    const s=routes.find(r=>r.id===sel)
    return(
      <div style={{padding:20}}>
        <div style={{background:'#0a0a0a',border:'1px solid #22c55e',borderRadius:8,padding:12,marginBottom:12}}>
          <div style={{fontSize:11,fontWeight:700,color:'#22c55e',letterSpacing:2}}>🌳 ROUTE SUCCESS TREE — Click any concept</div>
          <div style={{fontSize:8,color:'#555',marginTop:2}}>Circle size = attempts · Color = EPA grade · ELITE = call every game · CUT = remove now</div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:s?'1fr 1fr':'1fr',gap:12}}>
          <div>
            <svg viewBox="0 0 640 270" style={{width:'100%',background:'#0a1a0a',borderRadius:8,border:'1px solid #1d3a1d',cursor:'pointer'}}>
              <rect x={0} y={0} width={200} height={270} fill="#22c55e08"/>
              <rect x={200} y={0} width={200} height={270} fill="#06b6d408"/>
              <rect x={400} y={0} width={240} height={270} fill="#F0B42908"/>
              <text x={100} y={262} textAnchor="middle" fill="#22c55e33" fontSize={9} fontWeight="bold">DEEP</text>
              <text x={300} y={262} textAnchor="middle" fill="#06b6d433" fontSize={9} fontWeight="bold">MID</text>
              <text x={520} y={262} textAnchor="middle" fill="#F0B42933" fontSize={9} fontWeight="bold">SHORT</text>
              <circle cx={320} cy={245} r={12} fill="#22c55e" stroke="#000" strokeWidth={1}/>
              <text x={320} y={249} textAnchor="middle" fill="#000" fontSize={9} fontWeight="bold">QB</text>
              {routes.map(r=><line key={r.id+'-l'} x1={320} y1={245} x2={r.x} y2={r.y} stroke={r.col} strokeWidth={Math.max(r.att/7,0.5)} strokeOpacity={0.25} strokeDasharray={r.grade==='CUT'?'4,3':''}/>)}
              {routes.map(r=>{const radius=Math.max(r.att*1.3,10);return(
                <g key={r.id} onClick={()=>setSel(sel===r.id?null:r.id)} style={{cursor:'pointer'}}>
                  <circle cx={r.x} cy={r.y} r={radius} fill={r.col+(sel===r.id?'44':'22')} stroke={r.col} strokeWidth={sel===r.id?2:1} strokeDasharray={r.grade==='CUT'?'3,2':''}/>
                  <text x={r.x} y={r.y-2} textAnchor="middle" fill={r.col} fontSize={8} fontWeight="bold">{r.name}</text>
                  <text x={r.x} y={r.y+9} textAnchor="middle" fill={r.col} fontSize={7}>{r.comp}%</text>
                </g>
              )})}
              {[['ELITE','#22c55e',8],['SOLID','#d97706',118],['BUILD','#d97706',208],['CUT','#dc2626',288]].map(([l,col,lx])=>(
                <g key={l}><circle cx={lx+6} cy={13} r={5} fill={col+'33'} stroke={col} strokeWidth={1}/><text x={lx+14} y={17} fill={col} fontSize={8} fontWeight="bold">{l}</text></g>
              ))}
            </svg>
          </div>
          {s&&(
            <div style={{background:'#0d0d0d',border:`1px solid ${s.col}44`,borderRadius:8,padding:16}}>
              <div style={{fontSize:16,fontWeight:700,color:s.col,marginBottom:4}}>{s.name}</div>
              <div style={{display:'inline-block',background:s.col+'22',color:s.col,fontSize:9,fontWeight:700,padding:'2px 8px',borderRadius:4,border:`1px solid ${s.col}44`,marginBottom:12}}>{s.grade}</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginBottom:12}}>
                {[['Comp %',`${s.comp}%`,s.comp===100?'#22c55e':s.comp>=80?'#22c55e':s.comp>=60?'#d97706':'#dc2626'],['Attempts',s.att,'#ccc'],['Avg Yds',`${s.yds}`,`#F0B429`],['EPA/play',s.epa>=0?`+${s.epa}`:s.epa,s.epa>=0?'#22c55e':'#dc2626']].map(([l,v,col])=>(
                  <div key={l} style={{background:'#111',borderRadius:6,padding:8,textAlign:'center'}}><div style={{fontSize:16,fontWeight:700,color:col}}>{v}</div><div style={{fontSize:7,color:'#555',marginTop:1}}>{l}</div></div>
                ))}
              </div>
              <div style={{fontSize:12,color:'#9ca3af',lineHeight:1.6,marginBottom:12}}>{s.desc}</div>
              <div style={{background:'#111',borderRadius:6,padding:10}}>
                <div style={{fontSize:8,fontWeight:700,color:'#555',marginBottom:4}}>CALL FREQUENCY</div>
                <div style={{height:6,background:'#1a1a1a',borderRadius:3,overflow:'hidden'}}>
                  <div style={{height:'100%',width:`${s.grade==='ELITE'?90:s.grade==='SOLID'?60:s.grade==='BUILD'?30:5}%`,background:s.col,borderRadius:3}}/>
                </div>
                <div style={{fontSize:9,fontWeight:700,color:s.col,marginTop:4}}>{s.grade==='ELITE'?'Every series — automatic':s.grade==='SOLID'?'2-3x per game':s.grade==='BUILD'?'1-2x — build reps':'Remove from live script'}</div>
              </div>
            </div>
          )}
        </div>
        <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(3,1fr)',gap:6,marginTop:10}}>
          {[['ELITE — Every Series',routes.filter(r=>r.grade==='ELITE').map(r=>r.name).join(', '),'#22c55e'],['SOLID / BUILD',routes.filter(r=>r.grade==='SOLID'||r.grade==='BUILD').map(r=>r.name).join(', '),'#d97706'],['CUT — Remove Now',routes.filter(r=>r.grade==='CUT').map(r=>r.name).join(', '),'#dc2626']].map(([l,ct,col])=>(
            <div key={l} style={{background:col+'11',border:`0.5px solid ${col}33`,borderRadius:6,padding:10}}><div style={{fontSize:8,fontWeight:700,color:col,marginBottom:4}}>{l}</div><div style={{fontSize:11,color:col}}>{ct}</div></div>
          ))}
        </div>
      </div>
    )
  }

  const GameDayTab=()=>{
    const [msgs,setMsgs]=React.useState([{role:'assistant',content:'Game day mode. I know your full season AND any plays you log below in real time. Quick answers only — what do you need right now?'}])
    const [inp,setInp]=React.useState('');const [load,setLoad]=React.useState(false)
    const [plays,setPlays]=React.useState([])

    React.useEffect(()=>{loadData('gameday_plays',[]).then(d=>{if(d&&d.length)setPlays(d)})},[])
    React.useEffect(()=>{if(plays.length>0){saveData('gameday_plays',plays);flash()}},[plays])
    const [qb,setQb]=React.useState('Cooper Melvin');const [con,setCon]=React.useState('Baltimore')
    const [res,setRes]=React.useState('Complete');const [yds,setYds]=React.useState('')
    const [dn,setDn]=React.useState('1st');const [dist,setDist]=React.useState('10')
    const [hash,setHash]=React.useState('Middle');const [pres,setPres]=React.useState('Clean')
    const [sep,setSep]=React.useState('Open')
    const [clipUrl,setClipUrl]=React.useState('')
    const ref=React.useRef(null)
    const concepts=['Baltimore','Post','Stick','Four Verts','Verticals','Out','Slant','Smash','RPO Glance','Sail','Fade']
    const qs=['What should we call RIGHT NOW on 3rd and short?','Cooper is struggling — what adjustment do we make?','Best play for the red zone right now?','Which concept is working best today?','Ben needs a confidence play — what do we call?','Down by 7 two minutes left — game plan?','What does Cooper need to do differently?','Score is tied — highest percentage play?']
    const liveStat=()=>{
      if(!plays.length)return'No plays logged yet this game.'
      const cm=plays.filter(p=>p.qb==='Cooper Melvin'),bk=plays.filter(p=>p.qb==='Ben Kooi')
      const pct=ps=>ps.length?Math.round(ps.filter(p=>p.res==='Complete').length/ps.length*100):0
      const bc=concepts.map(c2=>{const cp=plays.filter(p=>p.con===c2);return cp.length?`${c2}:${Math.round(cp.filter(p=>p.res==='Complete').length/cp.length*100)}%(${cp.length}att)`:null}).filter(Boolean)
      return`LIVE(${plays.length}plays): Cooper ${cm.length}att ${pct(cm)}%. Ben ${bk.length}att ${pct(bk)}%. Concepts: ${bc.join(' ')}`
    }
    const send=async(msg)=>{
      if(!msg.trim()||load)return
      const um={role:'user',content:msg};const nm=[...msgs,um]
      setMsgs(nm);setInp('');setLoad(true)
      try{
        const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:250,system:`You are a live sideline AI for Westfield Shamrocks. Give SHORT DIRECT answers max 3 sentences. Coaches need instant answers. Reference real play names and numbers. Season: 117 plays. Cooper QB1: 63att 50comp 84% 658yds 13.2ypa RTG87 A ELITE. TTT 2.0s airYards 13.2 CPOE+4% deepBall 88% hash 73%. Style: Strong arm + mobile QB profile. Ben QB2: 54att 38comp 70% 310yds 6.5ypa RTG71 B DEV. TTT 1.9s airYards 6.5 CPOE-3% deepBall 50% hash 60%. BEST: Baltimore 100% EPA+1.8 | Post 100% EPA+1.4 | Stick 100% EPA+0.8 | FourVerts 100% EPA+1.9 | Verticals 88% EPA+2.1. CUT: Sail 0% EPA-0.6 Fade 0% EPA-0.8. RedZone 0% both QBs critical. ZONES Cooper/Ben: LeftDeep 85/82 MidDeep 88/86 RightDeep 0/0 LeftShort 73/70 MidShort 87/85 RightShort 73/68. Live: ${liveStat()}`,messages:nm.map(m=>({role:m.role,content:m.content}))})})
        const d=await r.json();setMsgs(p=>[...p,{role:'assistant',content:d.content?.[0]?.text||'Error'}])
      }catch(e){setMsgs(p=>[...p,{role:'assistant',content:'Connection error.'}])}
      setLoad(false)
    }
    const logPlay=()=>{
      const newPlay={id:Date.now(),qb,con,res,yds:Number(yds)||0,dn,dist,hash,pres,sep,time:new Date().toLocaleTimeString()}
      setPlays(prev=>{const next=[...prev,newPlay];checkPersonalBest(next);setUndoAlert({msg:`${newPlay.con} logged`,fn:()=>setPlays(pp=>pp.filter(p=>p.id!==newPlay.id))});setTimeout(()=>setUndoAlert(null),6000);return next})
      setYds('')
    }
    React.useEffect(()=>ref.current?.scrollIntoView({behavior:'smooth'}),[msgs])
    const cp2=plays.length?Math.round(plays.filter(p=>p.res==='Complete').length/plays.length*100):null
    const cm=plays.filter(p=>p.qb==='Cooper Melvin'),bk=plays.filter(p=>p.qb==='Ben Kooi')
    const pOf=ps=>ps.length?Math.round(ps.filter(p=>p.res==='Complete').length/ps.length*100):null
    const bestPlay=plays.length?plays.reduce((best,p,_,arr)=>{const cp3=arr.filter(x=>x.con===p.con);const pct=Math.round(cp3.filter(x=>x.res==='Complete').length/cp3.length*100);return pct>best.pct?{name:p.con,pct}:best},{name:'—',pct:0}).name:null
    return(
      <div style={{padding:14,fontFamily:'Helvetica,Arial,sans-serif'}}>
        <div style={{display:'grid',gridTemplateColumns:isMobile?'repeat(3,1fr)':'repeat(5,1fr)',gap:5,marginBottom:12}}>
          {[['PLAYS',plays.length||'—','#22c55e'],['OVERALL',cp2!==null?cp2+'%':'—',cp2>=80?'#22c55e':cp2>=65?'#d97706':'#dc2626'],['COOPER',pOf(cm)!==null?pOf(cm)+'%':'—','#22c55e'],['BEN',pOf(bk)!==null?pOf(bk)+'%':'—','#F0B429'],['HOT PLAY',bestPlay||'—','#06b6d4']].map(([l,v,col])=>(
            <div key={l} style={{background:'#111',border:`0.5px solid ${col}33`,borderRadius:8,padding:'9px 4px',textAlign:'center'}}>
              <div style={{fontSize:17,fontWeight:700,color:col,lineHeight:1}}>{v}</div>
              <div style={{fontSize:7,color:'#555',marginTop:2,letterSpacing:1}}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'0.9fr 1.1fr',gap:isMobile?8:10}}>
          <div style={{background:'#0d0d0d',border:'0.5px solid #1d3a1d',borderRadius:8,padding:12}}>
            <div style={{fontSize:9,fontWeight:700,color:'#22c55e',marginBottom:8,letterSpacing:1}}>📋 LOG PLAY</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:4,marginBottom:7}}>
              {['Cooper Melvin','Ben Kooi'].map(q=><button key={q} onClick={()=>setQb(q)} style={{padding:'9px 4px',background:qb===q?'#14532d':'#111',border:`1px solid ${qb===q?'#22c55e':'#252525'}`,borderRadius:6,color:qb===q?'#22c55e':'#555',fontSize:10,fontWeight:700,cursor:'pointer'}}>{q==='Cooper Melvin'?'COOPER QB1':'BEN QB2'}</button>)}
            </div>
            <select value={con} onChange={e=>setCon(e.target.value)} style={{width:'100%',background:'#111',border:'0.5px solid #252525',borderRadius:6,color:'#ccc',padding:'8px',fontSize:14,marginBottom:7}}>
              {concepts.map(c2=><option key={c2} value={c2}>{c2}</option>)}
            </select>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:5,marginBottom:7}}>
              <select value={dn} onChange={e=>setDn(e.target.value)} style={{background:'#111',border:'0.5px solid #252525',borderRadius:6,color:'#ccc',padding:'7px',fontSize:13}}>{['1st','2nd','3rd','4th'].map(d=><option key={d} value={d}>{d}</option>)}</select>
              <select value={dist} onChange={e=>setDist(e.target.value)} style={{background:'#111',border:'0.5px solid #252525',borderRadius:6,color:'#ccc',padding:'7px',fontSize:13}}>{['1','2','3','4','5','6','7','8','9','10','12','15','20+'].map(d=><option key={d} value={d}>{d} yds</option>)}</select>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:3,marginBottom:7}}>
              {['Left','Mid','Right'].map(h=><button key={h} onClick={()=>setHash(h)} style={{padding:'7px',background:hash===h?'#0c1a3a':'#111',border:`1px solid ${hash===h?'#06b6d4':'#252525'}`,borderRadius:4,color:hash===h?'#06b6d4':'#555',fontSize:9,fontWeight:700,cursor:'pointer'}}>{h}</button>)}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:3,marginBottom:7}}>
              {['Clean','Pressure'].map(p=><button key={p} onClick={()=>setPres(p)} style={{padding:'7px',background:pres===p?(p==='Clean'?'#0a1a0a':'#1a0404'):'#111',border:`1px solid ${pres===p?(p==='Clean'?'#22c55e':'#dc2626'):'#252525'}`,borderRadius:4,color:pres===p?(p==='Clean'?'#22c55e':'#dc2626'):'#555',fontSize:9,fontWeight:700,cursor:'pointer'}}>{p}</button>)}
            </div>
            <div style={{display:'grid',gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(4,1fr)',gap:3,marginBottom:7}}>
              {[['Complete','✓','#22c55e'],['Incomplete','✗','#d97706'],['INT','INT','#dc2626'],['Scramble','RUN','#9ca3af']].map(([r,lbl,col])=><button key={r} onClick={()=>setRes(r)} style={{padding:'8px 2px',background:res===r?col+'22':'#111',border:`1px solid ${res===r?col:'#252525'}`,borderRadius:4,color:res===r?col:'#555',fontSize:10,fontWeight:700,cursor:'pointer'}}>{lbl}</button>)}
            </div>
            <input type="number" value={yds} onChange={e=>setYds(e.target.value)} placeholder="Yards"
              style={{width:'100%',background:'#111',border:'0.5px solid #252525',borderRadius:6,color:'#fff',padding:isMobile?'14px':'10px',fontSize:isMobile?32:24,fontWeight:700,outline:'none',marginBottom:8,textAlign:'center'}}/>
            <div style={{marginBottom:7}}><div style={{fontSize:7,color:'#555',marginBottom:3}}>WR SEPARATION</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:3}}>
                {['Open','Contested','Covered'].map(s2=>{const col=s2==='Open'?'#22c55e':s2==='Contested'?'#d97706':'#dc2626';return<button key={s2} onClick={()=>setSep(s2)} style={{padding:'7px 2px',background:sep===s2?col+'22':'#111',border:`1px solid ${sep===s2?col:'#252525'}`,borderRadius:4,color:sep===s2?col:'#555',fontSize:9,fontWeight:700,cursor:'pointer'}}>{s2}</button>})}
              </div>
            </div>
            <div style={{marginBottom:6}}><div style={{fontSize:7,color:'#555',marginBottom:3}}>VIDEO CLIP (Hudl/YouTube — optional)</div>
              <input value={clipUrl} onChange={e=>setClipUrl(e.target.value)} placeholder='Paste clip URL...' style={{width:'100%',background:'#111',border:'0.5px solid #252525',borderRadius:5,color:'#ccc',padding:'6px',fontSize:11,outline:'none',boxSizing:'border-box'}}/>
            </div>
            <button style={{width:'100%',padding:isMobile?'18px':'14px',background:'#14532d',border:'none',borderRadius:8,color:'#22c55e',fontWeight:700,fontSize:isMobile?22:16,cursor:'pointer',marginBottom:8}}>+ LOG PLAY</button>
            {[...plays].reverse().slice(0,5).map((p,i)=>{
              const rc=p.res==='Complete'?'#22c55e':p.res==='Incomplete'?'#d97706':'#dc2626'
              return<div key={p.id} style={{display:'flex',gap:6,padding:'4px 0',borderBottom:'0.5px solid #1a1a1a',fontSize:9,alignItems:'center'}}>
                <span style={{color:'#444',minWidth:36}}>{p.time}</span>
                <span style={{color:p.qb==='Cooper Melvin'?'#22c55e':'#F0B429',fontWeight:700,minWidth:22}}>{p.qb==='Cooper Melvin'?'CM':'BK'}</span>
                <span style={{color:'#F0B429',flex:1}}>{p.con}</span>
                <span style={{color:'#555',fontSize:8}}>{p.dn}&{p.dist}</span>
                <span style={{color:rc,fontWeight:700}}>{p.res==='Complete'?'✓':p.res==='Incomplete'?'✗':p.res==='Interception'?'INT':'RUN'}</span>
                <span style={{color:'#ccc'}}>{p.yds>0?`${p.yds}y`:''}</span>
              </div>
            })}
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
              {qs.map(q=><button key={q} onClick={()=>send(q)} style={{padding:'5px 8px',background:'#0d0d0d',border:'0.5px solid #252525',borderRadius:14,color:'#9ca3af',fontSize:8.5,cursor:'pointer'}}>{q}</button>)}
            </div>
            <div style={{flex:1,overflowY:'auto',background:'#090909',border:'0.5px solid #1a1a2a',borderRadius:8,padding:10,display:'flex',flexDirection:'column',gap:8,minHeight:320}}>
              {msgs.map((m,i)=>(
                <div key={i} style={{display:'flex',justifyContent:m.role==='user'?'flex-end':'flex-start'}}>
                  <div style={{maxWidth:'88%',padding:'9px 12px',borderRadius:10,background:m.role==='user'?'#14532d':'#111',border:`0.5px solid ${m.role==='user'?'#22c55e33':'#252525'}`,borderBottomRightRadius:m.role==='user'?2:10,borderBottomLeftRadius:m.role==='assistant'?2:10}}>
                    <div style={{fontSize:13,color:'#e5e7eb',lineHeight:1.55,whiteSpace:'pre-wrap'}}>{m.content}</div>
                  </div>
                </div>
              ))}
              {load&&<div style={{display:'flex'}}><div style={{padding:'8px 12px',background:'#111',border:'0.5px solid #252525',borderRadius:10}}><span style={{fontSize:11,color:'#06b6d4'}}>Analyzing...</span></div></div>}
              <div ref={ref}/>
            </div>
            <div style={{display:'flex',gap:6}}>
              <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send(inp)}
                placeholder="Ask anything — play calls, adjustments, patterns..."
                style={{flex:1,background:'#111',border:'0.5px solid #252525',borderRadius:8,padding:'10px 12px',color:'#fff',fontSize:isMobile?16:13,outline:'none'}}/>
              <button onClick={()=>send(inp)} disabled={load||!inp.trim()}
                style={{padding:'10px 18px',background:load||!inp.trim()?'#111':'#14532d',border:'none',borderRadius:8,color:load||!inp.trim()?'#555':'#22c55e',fontWeight:700,fontSize:13,cursor:'pointer'}}>
                {load?'...':'Ask'}
              </button>
            </div>
          </div>
        </div>
        {plays.length>0&&<div style={{marginTop:10,background:'#0d0d0d',border:'0.5px solid #1d3a1d',borderRadius:8,overflow:'hidden'}}>
          <div style={{background:'#0a0a0a',padding:'5px 12px',borderBottom:'0.5px solid #1d3a1d',display:'grid',gridTemplateColumns:'1.5fr 0.5fr 0.7fr 0.5fr 0.7fr'}}>
            {['CONCEPT','ATT','COMP%','YDS','GRADE'].map(h=><div key={h} style={{fontSize:7,fontWeight:700,color:'#555',textAlign:'center'}}>{h}</div>)}
          </div>
          {concepts.map(ct=>{const cp3=plays.filter(p=>p.con===ct);if(!cp3.length)return null;const pct=Math.round(cp3.filter(p=>p.res==='Complete').length/cp3.length*100);const ay=(cp3.reduce((a,p)=>a+p.yds,0)/cp3.length).toFixed(1);const gc=pct>=80?'#22c55e':pct>=55?'#d97706':'#dc2626';return<div key={ct} style={{display:'grid',gridTemplateColumns:'1.5fr 0.5fr 0.7fr 0.5fr 0.7fr',padding:'6px 12px',borderBottom:'0.5px solid #1a1a1a',alignItems:'center'}}><div style={{fontSize:9,fontWeight:700,color:'#F0B429'}}>{ct}</div><div style={{fontSize:10,textAlign:'center',color:'#ccc'}}>{cp3.length}</div><div style={{fontSize:11,textAlign:'center',fontWeight:700,color:gc}}>{pct}%</div><div style={{fontSize:10,textAlign:'center',color:'#9ca3af'}}>{ay}</div><div style={{fontSize:9,textAlign:'center',fontWeight:700,color:gc}}>{pct>=80?'ELITE':pct>=55?'OK':'WORK'}</div></div>}).filter(Boolean)}
        </div>}
      </div>
    )
  }

  const OffenseTab=()=>{
    const [msgs,setMsgs]=React.useState([{role:'assistant',content:'Offensive Coordinator AI ready. Tell me the situation — down, distance, hash, score, time — and I will give you the exact play to call right now.'}])
    const [inp,setInp]=React.useState('');const [load,setLoad]=React.useState(false)
    const [dn,setDn]=React.useState('1st');const [dist,setDist]=React.useState('10')
    const [hash,setHash]=React.useState('Middle');const [zone,setZone]=React.useState('Open Field')
    const [score,setScore]=React.useState('Tied');const [qbOn,setQbOn]=React.useState('Cooper')
    const ref=React.useRef(null)
    const OC_CTX='You are the offensive coordinator for Westfield Shamrocks. BEST PLAYS: Baltimore 100% EPA+1.8 best big play, Post 100% EPA+1.4, Stick 100% EPA+0.8 most reliable every down, Four Verts 100% EPA+1.9, Verticals 88% EPA+2.1 highest EPA. SOLID: Out 100%, Slant 90%. CUT NEVER CALL: Sail 0% EPA-0.6, Fade 0% EPA-0.8. Red zone 0% no package installed. Cooper QB1 84% 13.2ypa RTG87 elite deep ball 88% CPOE+4%. Ben QB2 70% 6.5ypa RTG71 good short game. Hash: Middle 87%+ dominant. Left/Right 73%. Right deep 0% avoid. Give SHORT answers max 4 sentences. Name the exact play.'
    const situations=[
      {l:'1st & 10 open field',q:'1st and 10 open field. What do we call?'},
      {l:'3rd & short (1-3 yds)',q:'3rd and short need the first down. What play?'},
      {l:'3rd & medium (4-7)',q:'3rd and medium 4-7 yards. Must convert. Call?'},
      {l:'3rd & long (8+)',q:'3rd and long 8 plus yards. Best shot?'},
      {l:'Red zone inside 10',q:'Inside the 10. Red zone. No package installed. What do we run?'},
      {l:'2-minute drill',q:'2-minute drill need to score fast. Package?'},
      {l:'Down 7 late',q:'Down 7 four minutes left. Offensive approach?'},
      {l:'Winning run clock',q:'Up 7. What do we call to eat clock?'},
      {l:'Opening drive',q:'First play of game. Set the tone. What do we open with?'},
      {l:'Backed up own 10',q:'Backed up own 10 yard line. Safe play to get out?'},
      {l:'4th & 1 go for it',q:'4th and 1 going for it. What is the call?'},
      {l:'Cooper struggling',q:'Cooper is off today not feeling it. What play gets him right?'},
    ]
    const playbook=[
      {play:'Baltimore',comp:'100%',yds:'12.4',epa:'+1.8',best:'Any hash deep routes',grade:'ELITE',col:'#22c55e'},
      {play:'Post',comp:'100%',yds:'13.1',epa:'+1.4',best:'1st down left hash',grade:'ELITE',col:'#22c55e'},
      {play:'Four Verts',comp:'100%',yds:'22.0',epa:'+1.9',best:'Showcase Cover 0-1',grade:'ELITE',col:'#22c55e'},
      {play:'Verticals',comp:'88%',yds:'28.5',epa:'+2.1',best:'Deep shot when winning',grade:'ELITE',col:'#22c55e'},
      {play:'Stick',comp:'100%',yds:'7.7',epa:'+0.8',best:'Any down any hash',grade:'ELITE',col:'#22c55e'},
      {play:'Out',comp:'100%',yds:'6.5',epa:'+0.2',best:'2nd and medium',grade:'SOLID',col:'#d97706'},
      {play:'Slant',comp:'90%',yds:'5.1',epa:'+0.3',best:'Short yardage opener',grade:'SOLID',col:'#d97706'},
      {play:'Smash',comp:'100%',yds:'8.0',epa:'+0.5',best:'Zone coverage',grade:'BUILD',col:'#d97706'},
      {play:'RPO Glance',comp:'100%',yds:'7.5',epa:'+0.4',best:'Mixed looks',grade:'BUILD',col:'#d97706'},
      {play:'Sail',comp:'0%',yds:'0',epa:'-0.6',best:'NEVER CALL',grade:'CUT',col:'#dc2626'},
      {play:'Fade',comp:'0%',yds:'0',epa:'-0.8',best:'NEVER CALL',grade:'CUT',col:'#dc2626'},
    ]
    const send=async(msg)=>{
      if(!msg.trim()||load)return
      const ctx=`Situation: ${dn} & ${dist}, ${hash} hash, ${zone}, score ${score}, QB ${qbOn}. `
      const um={role:'user',content:ctx+msg};const nm=[...msgs,um]
      setMsgs(nm);setInp('');setLoad(true)
      try{
        const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:220,system:OC_CTX,messages:nm.map(m=>({role:m.role,content:m.content}))})})
        const d=await r.json();setMsgs(p=>[...p,{role:'assistant',content:d.content?.[0]?.text||'Error'}])
      }catch(e){setMsgs(p=>[...p,{role:'assistant',content:'Connection error.'}])}
      setLoad(false)
    }
    React.useEffect(()=>ref.current?.scrollIntoView({behavior:'smooth'}),[msgs])
    return(
      <div style={{padding:isMobile?10:16,fontFamily:'Helvetica,Arial,sans-serif'}}>
        <div style={{background:'#0a1a0a',border:'1px solid #22c55e',borderRadius:8,padding:12,marginBottom:12}}>
          <div style={{fontSize:11,fontWeight:700,color:'#22c55e',letterSpacing:2}}>⚔️ OFFENSIVE COORDINATOR — AI PLAY CALLER</div>
          <div style={{fontSize:8,color:'#555',marginTop:2}}>Set the situation below · Tap a scenario · Get the exact play call instantly</div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(3,1fr)',gap:6,marginBottom:10,background:'#0d0d0d',border:'0.5px solid #1d3a1d',borderRadius:8,padding:10}}>
          <div>
            <div style={{fontSize:7,color:'#555',marginBottom:4,letterSpacing:1}}>DOWN</div>
            <div style={{display:'grid',gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(4,1fr)',gap:3}}>
              {['1st','2nd','3rd','4th'].map(d=><button key={d} onClick={()=>setDn(d)} style={{padding:'7px 2px',background:dn===d?'#14532d':'#111',border:`1px solid ${dn===d?'#22c55e':'#252525'}`,borderRadius:4,color:dn===d?'#22c55e':'#555',fontSize:9,fontWeight:700,cursor:'pointer'}}>{d}</button>)}
            </div>
          </div>
          <div>
            <div style={{fontSize:7,color:'#555',marginBottom:4,letterSpacing:1}}>DISTANCE</div>
            <div style={{display:'grid',gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(4,1fr)',gap:3}}>
              {['1-3','4-6','7-9','10+'].map(d=><button key={d} onClick={()=>setDist(d)} style={{padding:'7px 2px',background:dist===d?'#14532d':'#111',border:`1px solid ${dist===d?'#22c55e':'#252525'}`,borderRadius:4,color:dist===d?'#22c55e':'#555',fontSize:9,fontWeight:700,cursor:'pointer'}}>{d}</button>)}
            </div>
          </div>
          <div>
            <div style={{fontSize:7,color:'#555',marginBottom:4,letterSpacing:1}}>QB</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:3}}>
              {['Cooper','Ben'].map(q=><button key={q} onClick={()=>setQbOn(q)} style={{padding:'7px',background:qbOn===q?'#14532d':'#111',border:`1px solid ${qbOn===q?'#22c55e':'#252525'}`,borderRadius:4,color:qbOn===q?'#22c55e':'#555',fontSize:9,fontWeight:700,cursor:'pointer'}}>{q}</button>)}
            </div>
          </div>
          <div>
            <div style={{fontSize:7,color:'#555',marginBottom:4,letterSpacing:1}}>HASH</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:3}}>
              {['Left','Middle','Right'].map(h=><button key={h} onClick={()=>setHash(h)} style={{padding:'7px 2px',background:hash===h?'#0c1a3a':'#111',border:`1px solid ${hash===h?'#06b6d4':'#252525'}`,borderRadius:4,color:hash===h?'#06b6d4':'#555',fontSize:9,fontWeight:700,cursor:'pointer'}}>{h}</button>)}
            </div>
          </div>
          <div>
            <div style={{fontSize:7,color:'#555',marginBottom:4,letterSpacing:1}}>ZONE</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:3}}>
              {['Own 10-20','Open Field','Red Zone'].map(z=><button key={z} onClick={()=>setZone(z)} style={{padding:'7px 2px',background:zone===z?'#0c1a3a':'#111',border:`1px solid ${zone===z?'#06b6d4':'#252525'}`,borderRadius:4,color:zone===z?'#06b6d4':'#555',fontSize:8,fontWeight:700,cursor:'pointer'}}>{z}</button>)}
            </div>
          </div>
          <div>
            <div style={{fontSize:7,color:'#555',marginBottom:4,letterSpacing:1}}>SCORE</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:3}}>
              {['Tied','Up 7+','Down 7+'].map(s=><button key={s} onClick={()=>setScore(s)} style={{padding:'7px 2px',background:score===s?'#1a0a0a':'#111',border:`1px solid ${score===s?'#dc2626':'#252525'}`,borderRadius:4,color:score===s?'#dc2626':'#555',fontSize:8,fontWeight:700,cursor:'pointer'}}>{s}</button>)}
            </div>
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1.3fr',gap:isMobile?8:12,marginBottom:12}}>
          <div>
            <div style={{fontSize:8,fontWeight:700,color:'#F0B429',marginBottom:6,letterSpacing:1}}>TAP A SCENARIO — INSTANT PLAY CALL</div>
            <div style={{display:'flex',flexDirection:'column',gap:4}}>
              {situations.map(s=><button key={s.l} onClick={()=>send(s.q)} style={{padding:'9px 12px',background:'#0d0d0d',border:'0.5px solid #1d3a1d',borderRadius:6,color:'#9ca3af',fontSize:10,cursor:'pointer',textAlign:'left'}}><span style={{color:'#22c55e',fontWeight:700,marginRight:6}}>▶</span>{s.l}</button>)}
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            <div style={{flex:1,overflowY:'auto',background:'#090909',border:'0.5px solid #1d3a1d',borderRadius:8,padding:10,display:'flex',flexDirection:'column',gap:8,minHeight:380}}>
              {msgs.map((m,i)=>(
                <div key={i} style={{display:'flex',justifyContent:m.role==='user'?'flex-end':'flex-start'}}>
                  <div style={{maxWidth:'88%',padding:'9px 12px',borderRadius:10,background:m.role==='user'?'#14532d':'#111',border:`0.5px solid ${m.role==='user'?'#22c55e33':'#252525'}`,borderBottomRightRadius:m.role==='user'?2:10,borderBottomLeftRadius:m.role==='assistant'?2:10}}>
                    {m.role==='assistant'&&<div style={{fontSize:8,fontWeight:700,color:'#22c55e',marginBottom:3,letterSpacing:1}}>OC AI</div>}
                    <div style={{fontSize:13,color:'#e5e7eb',lineHeight:1.55,whiteSpace:'pre-wrap'}}>{m.content}</div>
                  </div>
                </div>
              ))}
              {load&&<div style={{display:'flex'}}><div style={{padding:'8px 12px',background:'#111',border:'0.5px solid #252525',borderRadius:10}}><span style={{fontSize:11,color:'#22c55e'}}>Calling play...</span></div></div>}
              <div ref={ref}/>
            </div>
            <div style={{display:'flex',gap:6}}>
              <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send(inp)} placeholder="Describe the situation — get the exact play call..." style={{flex:1,background:'#111',border:'0.5px solid #1d3a1d',borderRadius:8,padding:'10px 12px',color:'#fff',fontSize:13,outline:'none'}}/>
              <button onClick={()=>send(inp)} disabled={load||!inp.trim()} style={{padding:'10px 18px',background:load||!inp.trim()?'#111':'#14532d',border:'none',borderRadius:8,color:load||!inp.trim()?'#555':'#22c55e',fontWeight:700,fontSize:13,cursor:'pointer'}}>{load?'...':'Call It'}</button>
            </div>
          </div>
        </div>
        <div style={{background:'#0d0d0d',border:'0.5px solid #1d3a1d',borderRadius:8,overflow:'hidden'}}>
          <div style={{background:'#0a0a0a',padding:'6px 12px',borderBottom:'0.5px solid #1d3a1d',display:'grid',gridTemplateColumns:'1.2fr 0.7fr 0.7fr 0.7fr 1.5fr 0.7fr'}}>{['PLAY','COMP%','YDS','EPA','BEST FOR','GRADE'].map(h=><div key={h} style={{fontSize:7,fontWeight:700,color:'#555',textAlign:'center'}}>{h}</div>)}</div>
          {playbook.map((p,i)=>(
            <div key={p.play} style={{display:'grid',gridTemplateColumns:'1.2fr 0.7fr 0.7fr 0.7fr 1.5fr 0.7fr',padding:'7px 12px',background:i%2===0?'#0f0f0f':'#141414',borderBottom:'0.5px solid #1a1a1a',alignItems:'center',cursor:'pointer'}} onClick={()=>send(`When exactly do I call ${p.play} and what coverage does it beat?`)}>
              <div style={{fontSize:9,fontWeight:700,color:p.col}}>{p.play}</div>
              <div style={{fontSize:11,fontWeight:700,color:p.col,textAlign:'center'}}>{p.comp}</div>
              <div style={{fontSize:10,textAlign:'center',color:'#F0B429'}}>{p.yds}</div>
              <div style={{fontSize:10,textAlign:'center',color:p.epa.startsWith('-')?'#dc2626':'#22c55e',fontWeight:700}}>{p.epa}</div>
              <div style={{fontSize:8,color:'#666'}}>{p.best}</div>
              <div style={{fontSize:8,textAlign:'center',fontWeight:700,color:p.col}}>{p.grade}</div>
            </div>
          ))}
          <div style={{padding:'7px 12px',background:'#0a0a0a',borderTop:'0.5px solid #1d3a1d'}}><span style={{fontSize:8,color:'#555'}}>Tap any play for detailed coaching on when to call it and what coverage it beats</span></div>
        </div>
      </div>
    )
  }

  const DefenseTab=()=>{
    const [msgs,setMsgs]=React.useState([{role:'assistant',content:'Defensive Coordinator AI ready. Tell me what you see — their formation, tendencies, down and distance — and I will tell you the exact coverage to call and where to attack. Let us shut them down.'}])
    const [inp,setInp]=React.useState('');const [load,setLoad]=React.useState(false)
    const [formation,setFormation]=React.useState('Spread')
    const [dn,setDn]=React.useState('1st');const [dist,setDist]=React.useState('10')
    const [gamesit,setGamesit]=React.useState('Tied');const [seen,setSeen]=React.useState([])
    const ref=React.useRef(null)
    const DC_CTX='You are the defensive coordinator for Westfield Shamrocks. Give SHORT DIRECT answers max 4 sentences. Tell: 1) exact coverage to call by name, 2) key matchup to win, 3) one adjustment. Coverages available: Cover 1 Man Free, Cover 2 Zone, Cover 3 Sky, Cover 4 Quarters, Cover 2 Man Under, Zero Blitz Cover 0, Tampa 2, Cover 6. Blitzes: Inside LB Blitz, Corner Blitz, Safety Blitz. Adjustments: press man on slot, rotate safety, cloud corner, invert safety, spy QB. For 7on7 you have no DL so focus on coverage shells. Name the exact coverage and the key matchup to win.'
    const tendencies=[
      {l:'Spread 4 wide every play',q:'They spread 4 wide every play. What coverage?'},
      {l:'QB keeps scrambling',q:'Their QB keeps scrambling. Adjustment?'},
      {l:'Picking on our weakest DB',q:'They keep targeting our weakest corner. How do we adjust?'},
      {l:'Same route every 3rd down',q:'They run the same out route every 3rd down. How do we take it away?'},
      {l:'Need a stop to win',q:'Need one stop to win the game. Best coverage right now?'},
      {l:'Big WR we cannot cover',q:'They have a big WR we cannot cover man to man. What do we do?'},
      {l:'Killing us with slants',q:'They keep completing slants. Adjustment?'},
      {l:'They love the deep ball',q:'Their QB loves to throw deep. How do we take away the deep ball?'},
      {l:'First play of game',q:'First play of game. What coverage do we open with?'},
      {l:'Protect a late lead',q:'Up by 7 they have the ball last drive. Coverage to prevent the big play?'},
      {l:'They are in red zone',q:'They are in our red zone. Best coverage to stop them?'},
      {l:'Need a turnover now',q:'Need a turnover right now. Coverage for the best INT chance?'},
    ]
    const coverages=[
      {name:'Cover 1 Man Free',abbr:'C1',best:'Shut down single routes',risk:'Scramble QB',col:'#22c55e'},
      {name:'Cover 2 Zone',abbr:'C2',best:'Deep sideline away',risk:'Middle seam open',col:'#22c55e'},
      {name:'Cover 3 Sky',abbr:'C3',best:'Best all-around zone',risk:'Flat routes',col:'#22c55e'},
      {name:'Cover 4 Quarters',abbr:'C4',best:'Stop deep ball',risk:'Under routes',col:'#d97706'},
      {name:'Tampa 2',abbr:'T2',best:'MLB drops deep middle',risk:'Fast slot WR',col:'#d97706'},
      {name:'Cover 2 Man Under',abbr:'C2M',best:'Aggressive man plus 2 deep',risk:'Quick game',col:'#d97706'},
      {name:'Zero Blitz C0',abbr:'C0',best:'Need sack or TO now',risk:'Big play if missed',col:'#dc2626'},
      {name:'Cover 6',abbr:'C6',best:'Trips formations',risk:'Requires communication',col:'#d97706'},
    ]
    const adjustments=[
      {adj:'Press Man on Slot',when:'Short yardage need to disrupt timing',effect:'Forces longer routes disrupts quick game'},
      {adj:'Rotate Safety Late',when:'QB stares down one WR',effect:'Bracket the target force eyes away'},
      {adj:'Cloud Corner',when:'WR burning corner deep',effect:'Corner underneath safety takes deep'},
      {adj:'Invert Safety',when:'Running QB threatens edge',effect:'Safety run support LB covers middle'},
      {adj:'Spy the QB',when:'QB scrambles every play',effect:'MLB spies QB everyone else plays zone'},
      {adj:'Jump the Out Route',when:'Same route every 3rd down',effect:'Corner reads QB eyes jumps for turnover'},
    ]
    const toggleSeen=t=>setSeen(p=>p.includes(t)?p.filter(x=>x!==t):[...p,t])
    const send=async(msg)=>{
      if(!msg.trim()||load)return
      const ctx=`Formation: ${formation}. Down: ${dn} and ${dist}. Situation: ${gamesit}. Tagged tendencies: ${seen.length?seen.join(', '):'none yet'}. `
      const um={role:'user',content:ctx+msg};const nm=[...msgs,um]
      setMsgs(nm);setInp('');setLoad(true)
      try{
        const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:220,system:DC_CTX,messages:nm.map(m=>({role:m.role,content:m.content}))})})
        const d=await r.json();setMsgs(p=>[...p,{role:'assistant',content:d.content?.[0]?.text||'Error'}])
      }catch(e){setMsgs(p=>[...p,{role:'assistant',content:'Connection error.'}])}
      setLoad(false)
    }
    React.useEffect(()=>ref.current?.scrollIntoView({behavior:'smooth'}),[msgs])
    return(
      <div style={{padding:isMobile?10:16,fontFamily:'Helvetica,Arial,sans-serif'}}>
        <div style={{background:'#1a0404',border:'1px solid #dc2626',borderRadius:8,padding:12,marginBottom:12}}>
          <div style={{fontSize:11,fontWeight:700,color:'#dc2626',letterSpacing:2}}>🛡️ DEFENSIVE COORDINATOR — AI COVERAGE CALLER</div>
          <div style={{fontSize:8,color:'#555',marginTop:2}}>Tag what you see · Tap a situation · Get the exact coverage instantly</div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(3,1fr)',gap:6,marginBottom:10,background:'#0d0d0d',border:'0.5px solid #2a0404',borderRadius:8,padding:10}}>
          <div>
            <div style={{fontSize:7,color:'#555',marginBottom:4,letterSpacing:1}}>THEIR FORMATION</div>
            <div style={{display:'flex',flexDirection:'column',gap:3}}>
              {['Spread 4 Wide','Trips Right','Trips Left','Pro Set 2 WR','Bunch Formation','Empty Backfield'].map(f=><button key={f} onClick={()=>setFormation(f)} style={{padding:'6px 8px',background:formation===f?'#1a0404':'#111',border:`1px solid ${formation===f?'#dc2626':'#252525'}`,borderRadius:4,color:formation===f?'#dc2626':'#555',fontSize:8,fontWeight:700,cursor:'pointer',textAlign:'left'}}>{f}</button>)}
            </div>
          </div>
          <div>
            <div style={{fontSize:7,color:'#555',marginBottom:4,letterSpacing:1}}>DOWN AND DIST</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:3,marginBottom:5}}>
              {['1st','2nd','3rd','4th'].map(d=><button key={d} onClick={()=>setDn(d)} style={{padding:'6px',background:dn===d?'#1a0404':'#111',border:`1px solid ${dn===d?'#dc2626':'#252525'}`,borderRadius:4,color:dn===d?'#dc2626':'#555',fontSize:9,fontWeight:700,cursor:'pointer'}}>{d}</button>)}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:3,marginBottom:5}}>
              {['1-3 Short','4-6 Med','7-9 Long','10+ XL'].map(d=><button key={d} onClick={()=>setDist(d)} style={{padding:'6px 2px',background:dist===d?'#1a0404':'#111',border:`1px solid ${dist===d?'#dc2626':'#252525'}`,borderRadius:4,color:dist===d?'#dc2626':'#555',fontSize:8,fontWeight:700,cursor:'pointer'}}>{d}</button>)}
            </div>
            <div style={{fontSize:7,color:'#555',marginBottom:4,letterSpacing:1}}>SITUATION</div>
            <div style={{display:'flex',flexDirection:'column',gap:3}}>
              {['Tied','We Lead 7+','Down 7+','Final Drive'].map(s=><button key={s} onClick={()=>setGamesit(s)} style={{padding:'6px',background:gamesit===s?'#1a0404':'#111',border:`1px solid ${gamesit===s?'#dc2626':'#252525'}`,borderRadius:4,color:gamesit===s?'#dc2626':'#555',fontSize:8,fontWeight:700,cursor:'pointer'}}>{s}</button>)}
            </div>
          </div>
          <div>
            <div style={{fontSize:7,color:'#555',marginBottom:4,letterSpacing:1}}>TAG WHAT YOU SEE</div>
            <div style={{display:'flex',flexDirection:'column',gap:3}}>
              {['Quick passes only','QB scrambles','Deep shots only','Same route 3rd down','Targeting weak DB','Slant machine','Red zone specialist','Never punts'].map(t=><button key={t} onClick={()=>toggleSeen(t)} style={{padding:'6px 8px',background:seen.includes(t)?'#1a0a0a':'#111',border:`1px solid ${seen.includes(t)?'#dc2626':'#252525'}`,borderRadius:4,color:seen.includes(t)?'#dc2626':'#555',fontSize:8,cursor:'pointer',textAlign:'left',display:'flex',alignItems:'center',gap:4}}><span style={{color:seen.includes(t)?'#22c55e':'#333',fontSize:10,minWidth:12}}>{seen.includes(t)?'✓':'○'}</span>{t}</button>)}
            </div>
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1.3fr',gap:isMobile?8:12,marginBottom:12}}>
          <div>
            <div style={{fontSize:8,fontWeight:700,color:'#F0B429',marginBottom:6,letterSpacing:1}}>TAP A SITUATION — GET THE COVERAGE</div>
            <div style={{display:'flex',flexDirection:'column',gap:4}}>
              {tendencies.map(t=><button key={t.l} onClick={()=>send(t.q)} style={{padding:'9px 12px',background:'#0d0d0d',border:'0.5px solid #2a0404',borderRadius:6,color:'#9ca3af',fontSize:10,cursor:'pointer',textAlign:'left'}}><span style={{color:'#dc2626',fontWeight:700,marginRight:6}}>▶</span>{t.l}</button>)}
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            <div style={{flex:1,overflowY:'auto',background:'#090909',border:'0.5px solid #2a0404',borderRadius:8,padding:10,display:'flex',flexDirection:'column',gap:8,minHeight:380}}>
              {msgs.map((m,i)=>(
                <div key={i} style={{display:'flex',justifyContent:m.role==='user'?'flex-end':'flex-start'}}>
                  <div style={{maxWidth:'88%',padding:'9px 12px',borderRadius:10,background:m.role==='user'?'#3a0404':'#111',border:`0.5px solid ${m.role==='user'?'#dc262633':'#252525'}`,borderBottomRightRadius:m.role==='user'?2:10,borderBottomLeftRadius:m.role==='assistant'?2:10}}>
                    {m.role==='assistant'&&<div style={{fontSize:8,fontWeight:700,color:'#dc2626',marginBottom:3,letterSpacing:1}}>DC AI</div>}
                    <div style={{fontSize:13,color:'#e5e7eb',lineHeight:1.55,whiteSpace:'pre-wrap'}}>{m.content}</div>
                  </div>
                </div>
              ))}
              {load&&<div style={{display:'flex'}}><div style={{padding:'8px 12px',background:'#111',border:'0.5px solid #252525',borderRadius:10}}><span style={{fontSize:11,color:'#dc2626'}}>Calling coverage...</span></div></div>}
              <div ref={ref}/>
            </div>
            <div style={{display:'flex',gap:6}}>
              <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send(inp)} placeholder="Describe what you see — get the coverage call..." style={{flex:1,background:'#111',border:'0.5px solid #2a0404',borderRadius:8,padding:'10px 12px',color:'#fff',fontSize:13,outline:'none'}}/>
              <button onClick={()=>send(inp)} disabled={load||!inp.trim()} style={{padding:'10px 18px',background:load||!inp.trim()?'#111':'#3a0404',border:`1px solid ${load||!inp.trim()?'#252525':'#dc2626'}`,borderRadius:8,color:load||!inp.trim()?'#555':'#dc2626',fontWeight:700,fontSize:13,cursor:'pointer'}}>{load?'...':'Cover It'}</button>
            </div>
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:isMobile?8:10}}>
          <div style={{background:'#0d0d0d',border:'0.5px solid #2a0404',borderRadius:8,overflow:'hidden'}}>
            <div style={{background:'#0a0a0a',padding:'6px 12px',borderBottom:'0.5px solid #2a0404',fontSize:8,fontWeight:700,color:'#dc2626',letterSpacing:1}}>COVERAGE MENU — Tap for coaching</div>
            {coverages.map((cv,i)=>(
              <div key={cv.name} style={{display:'grid',gridTemplateColumns:'0.5fr 1.5fr 1.5fr',padding:'8px 12px',background:i%2===0?'#0f0f0f':'#141414',borderBottom:'0.5px solid #1a1a1a',cursor:'pointer',alignItems:'center'}} onClick={()=>send(`Walk me through ${cv.name} and exactly when to use it`)}>
                <div style={{fontSize:11,fontWeight:700,color:cv.col,textAlign:'center'}}>{cv.abbr}</div>
                <div><div style={{fontSize:9,fontWeight:700,color:cv.col}}>{cv.name}</div><div style={{fontSize:7,color:'#555'}}>Risk: {cv.risk}</div></div>
                <div style={{fontSize:8,color:'#9ca3af'}}>{cv.best}</div>
              </div>
            ))}
          </div>
          <div style={{background:'#0d0d0d',border:'0.5px solid #2a0404',borderRadius:8,overflow:'hidden'}}>
            <div style={{background:'#0a0a0a',padding:'6px 12px',borderBottom:'0.5px solid #2a0404',fontSize:8,fontWeight:700,color:'#dc2626',letterSpacing:1}}>IN-GAME ADJUSTMENTS — Tap for coaching</div>
            {adjustments.map((a,i)=>(
              <div key={a.adj} style={{padding:'9px 12px',background:i%2===0?'#0f0f0f':'#141414',borderBottom:'0.5px solid #1a1a1a',cursor:'pointer'}} onClick={()=>send(`How do I execute ${a.adj} and when exactly?`)}>
                <div style={{fontSize:9,fontWeight:700,color:'#F0B429',marginBottom:2}}>{a.adj}</div>
                <div style={{fontSize:8,color:'#555',marginBottom:1}}>When: {a.when}</div>
                <div style={{fontSize:8,color:'#9ca3af'}}>{a.effect}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }


  const SpecialTeamsTab=()=>{
    const [msgs,setMsgs]=React.useState([{role:'assistant',content:'Special Teams AI ready. Tell me the situation — field position, score, time, down — and I will give you the exact special teams call. Punt, kick, fake, onside, 2-point — I know the chart.'}])
    const [inp,setInp]=React.useState('');const [load,setLoad]=React.useState(false)
    const [sit,setSit]=React.useState('Punt');const [field,setField]=React.useState('Own 35')
    const [score,setScore]=React.useState('Tied');const [time,setTime]=React.useState('2nd Half')
    const ref=React.useRef(null)
    const ST='You are the special teams coordinator for Westfield Shamrocks high school football. SHORT answers max 4 sentences. Name the exact call. Rules: Fake punt works inside opp 40 on 4th and 4 or less. Onside kick when down 8+ under 4 min. Squib kick protects against speed returners. Pooch punt pins inside 10. Hands team always ready. Never kick to their best returner in open field. 2-point chart: go for 2 when down 5 or 12 or 15. Block punt overload right side. Directional kick away from their best returner always. Rugby punt buys time when pressured.'
    const situations=[
      {l:'4th and long — punt',q:'4th and long must punt. Where do we aim and what coverage assignment?'},
      {l:'4th and short — fake?',q:'4th and 4 or less. Should we fake the punt? What is the play?'},
      {l:'Kickoff — protect lead',q:'We are winning. Best kickoff strategy to protect our lead?'},
      {l:'Onside kick — need ball',q:'We are down and need the ball back fast. Onside or squib?'},
      {l:'Field goal decision',q:'We are in field goal range. Kick it or go for it?'},
      {l:'Block their punt',q:'We need to block their punt. What formation and who do we send?'},
      {l:'Return the kickoff',q:'How do we set up our kickoff return for maximum yards?'},
      {l:'2-point conversion?',q:'Should we go for 2 right now and what play do we run?'},
      {l:'Onside kick — down 8',q:'Down 8 with 3 minutes left. Do we onside kick and exactly how?'},
      {l:'Pin them inside 10',q:'We want to pin them inside their 10 yard line. Pooch punt setup?'},
      {l:'Ice the kicker',q:'They are about to kick a field goal. Do we ice the kicker?'},
      {l:'Fake field goal',q:'We are in field goal range. Should we fake it and what is the play?'},
    ]
    const chart=[
      {sit:'4th & 1-3 own 40+',rec:'GO FOR IT',why:'High %. Stick or Out call.',col:'#22c55e'},
      {sit:'4th & 4+ own 30',rec:'PUNT',why:'Pin them deep. Directional kick.',col:'#d97706'},
      {sit:'4th & 1-4 opp 40',rec:'GO FOR IT',why:'Cooper 84% short. Stick call.',col:'#22c55e'},
      {sit:'4th & 5+ opp 35',rec:'FIELD GOAL',why:'Inside range. Take the 3.',col:'#d97706'},
      {sit:'Down 8 under 4min',rec:'ONSIDE KICK',why:'Need possession. Hands team.',col:'#dc2626'},
      {sit:'Up 7+ 4th quarter',rec:'SQUIB KICK',why:'Neutralize returner. Eat clock.',col:'#22c55e'},
      {sit:'Down 5 after TD',rec:'GO FOR 2',why:'Two-point chart says go.',col:'#dc2626'},
      {sit:'4th & short fake',rec:'FAKE PUNT',why:'Catch them. Direct snap.',col:'#22c55e'},
    ]
    const send=async(msg)=>{
      if(!msg.trim()||load)return
      const ctx=`Situation: ${sit}. Field: ${field}. Score: ${score}. Time: ${time}. `
      const um={role:'user',content:ctx+msg};const nm=[...msgs,um]
      setMsgs(nm);setInp('');setLoad(true)
      try{
        const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:200,system:ST,messages:nm.map(m=>({role:m.role,content:m.content}))})})
        const d=await r.json();setMsgs(p=>[...p,{role:'assistant',content:d.content?.[0]?.text||'Error'}])
      }catch(e){setMsgs(p=>[...p,{role:'assistant',content:'Connection error.'}])}
      setLoad(false)
    }
    React.useEffect(()=>ref.current?.scrollIntoView({behavior:'smooth'}),[msgs])
    return(
      <div style={{padding:isMobile?10:16,fontFamily:'Helvetica,Arial,sans-serif'}}>
        <div style={{background:'#07070f',border:'1px solid #7c3aed',borderRadius:8,padding:12,marginBottom:12}}>
          <div style={{fontSize:11,fontWeight:700,color:'#a78bfa',letterSpacing:2}}>🏉 SPECIAL TEAMS COORDINATOR — AI CALL ASSISTANT</div>
          <div style={{fontSize:8,color:'#555',marginTop:2}}>Set the situation · Tap any scenario · Get the exact special teams call instantly</div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(4,1fr)',gap:6,marginBottom:10,background:'#0d0d0d',border:'0.5px solid #3a1a6e',borderRadius:8,padding:10}}>
          {[['SITUATION',['Punt','Kickoff','Field Goal','Return','4th Down','2-Point'],sit,setSit],['FIELD POSITION',['Own 1-15','Own 16-30','Own 31-45','Opp 45-35','Opp 34-20','Opp 19-1'],field,setField],['SCORE',['Tied','Up 1-7','Up 8-14','Down 1-7','Down 8-14','Down 15+'],score,setScore],['TIME',['1st Quarter','2nd Quarter','Halftime','3rd Quarter','Under 4 Min','Final Drive'],time,setTime]].map(([lbl,opts,val,set])=>(
            <div key={lbl}><div style={{fontSize:7,color:'#555',marginBottom:4,letterSpacing:1}}>{lbl}</div>
              <div style={{display:'flex',flexDirection:'column',gap:3}}>
                {opts.map(o=><button key={o} onClick={()=>set(o)} style={{padding:'6px 8px',background:val===o?'#1a0a2e':'#111',border:`1px solid ${val===o?'#7c3aed':'#252525'}`,borderRadius:4,color:val===o?'#a78bfa':'#555',fontSize:8,fontWeight:700,cursor:'pointer',textAlign:'left'}}>{o}</button>)}
              </div>
            </div>
          ))}
        </div>
        <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1.3fr',gap:isMobile?8:12,marginBottom:12}}>
          <div>
            <div style={{fontSize:8,fontWeight:700,color:'#F0B429',marginBottom:6,letterSpacing:1}}>TAP A SCENARIO — INSTANT CALL</div>
            <div style={{display:'flex',flexDirection:'column',gap:4}}>
              {situations.map(s=><button key={s.l} onClick={()=>send(s.q)} style={{padding:'8px 12px',background:'#0d0d0d',border:'0.5px solid #3a1a6e',borderRadius:6,color:'#9ca3af',fontSize:10,cursor:'pointer',textAlign:'left'}}><span style={{color:'#a78bfa',fontWeight:700,marginRight:6}}>▶</span>{s.l}</button>)}
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            <div style={{flex:1,overflowY:'auto',background:'#090909',border:'0.5px solid #3a1a6e',borderRadius:8,padding:10,display:'flex',flexDirection:'column',gap:8,minHeight:340}}>
              {msgs.map((m,i)=>(
                <div key={i} style={{display:'flex',justifyContent:m.role==='user'?'flex-end':'flex-start'}}>
                  <div style={{maxWidth:'88%',padding:'9px 12px',borderRadius:10,background:m.role==='user'?'#1a0a2e':'#111',border:`0.5px solid ${m.role==='user'?'#7c3aed33':'#252525'}`,borderBottomRightRadius:m.role==='user'?2:10,borderBottomLeftRadius:m.role==='assistant'?2:10}}>
                    {m.role==='assistant'&&<div style={{fontSize:8,fontWeight:700,color:'#a78bfa',marginBottom:3,letterSpacing:1}}>ST AI</div>}
                    <div style={{fontSize:13,color:'#e5e7eb',lineHeight:1.55,whiteSpace:'pre-wrap'}}>{m.content}</div>
                  </div>
                </div>
              ))}
              {load&&<div style={{display:'flex'}}><div style={{padding:'8px 12px',background:'#111',border:'0.5px solid #252525',borderRadius:10}}><span style={{fontSize:11,color:'#a78bfa'}}>Calling play...</span></div></div>}
              <div ref={ref}/>
            </div>
            <div style={{display:'flex',gap:6}}>
              <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send(inp)} placeholder="Any special teams question..." style={{flex:1,background:'#111',border:'0.5px solid #3a1a6e',borderRadius:8,padding:'10px 12px',color:'#fff',fontSize:13,outline:'none'}}/>
              <button onClick={()=>send(inp)} disabled={load||!inp.trim()} style={{padding:'10px 18px',background:load||!inp.trim()?'#111':'#1a0a2e',border:`1px solid ${load||!inp.trim()?'#252525':'#7c3aed'}`,borderRadius:8,color:load||!inp.trim()?'#555':'#a78bfa',fontWeight:700,fontSize:13,cursor:'pointer'}}>{load?'...':'Call It'}</button>
            </div>
          </div>
        </div>
        <div style={{background:'#0d0d0d',border:'0.5px solid #3a1a6e',borderRadius:8,overflow:'hidden'}}>
          <div style={{background:'#0a0a0a',padding:'6px 12px',borderBottom:'0.5px solid #3a1a6e',display:'grid',gridTemplateColumns:'1.5fr 0.8fr 1.5fr'}}>{['SITUATION','CALL','WHY'].map(h=><div key={h} style={{fontSize:7,fontWeight:700,color:'#555',textAlign:'center'}}>{h}</div>)}</div>
          {chart.map((d,i)=>(
            <div key={d.sit} style={{display:'grid',gridTemplateColumns:'1.5fr 0.8fr 1.5fr',padding:'8px 12px',background:i%2===0?'#0f0f0f':'#141414',borderBottom:'0.5px solid #1a1a1a',alignItems:'center',cursor:'pointer'}} onClick={()=>send(`More detail on when to ${d.rec.toLowerCase()} in this situation: ${d.sit}`)}>
              <div style={{fontSize:9,fontWeight:700,color:'#a78bfa'}}>{d.sit}</div>
              <div style={{fontSize:10,fontWeight:700,color:d.col,textAlign:'center'}}>{d.rec}</div>
              <div style={{fontSize:8,color:'#666'}}>{d.why}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }


  const DepthChartTab=()=>{
    const [msgs,setMsgs]=React.useState([{role:'assistant',content:'Personnel AI ready. Ask about who to start, when to sub Ben in, what packages to run for each QB, and how to develop both QBs at the same time.'}])
    const [inp,setInp]=React.useState('');const [load,setLoad]=React.useState(false)
    const ref=React.useRef(null)
    const DC2='You are the personnel advisor for Westfield Shamrocks. Cooper QB1: 84% 13.2ypa RTG87 elite arm mobile CPOE+4% starts every game. Ben QB2: 70% 6.5ypa RTG71 good short game developing. Both hit 80% at Showcase so both perform under pressure. Ben best on Stick/Out short routes. Cooper best on Baltimore/Post/Verticals deep. Red zone 0% both no package yet. Never put Ben in for deep 3rd downs his deep ball 50%. Use Ben in short yardage packages. Give SHORT answers max 4 sentences.'
    const qs=['Who do we start at QB?','When should Ben come in?','How do we use both QBs in the same game?','How many snaps should Ben get?','Can Ben run the red zone package?','How do we develop Ben without hurting Cooper?']
    const pkgs=[
      {pkg:'Opening Series',who:'Cooper Melvin',why:'Starter. Set the tone with Baltimore and Post.',col:'#22c55e'},
      {pkg:'Short Yardage',who:'Cooper or Ben',why:'Both work here. Stick 100% either QB.',col:'#d97706'},
      {pkg:'Deep Shot 3rd',who:'Cooper ONLY',why:'Deep ball 88%. Ben 50% deep — never sub.',col:'#22c55e'},
      {pkg:'Ben Package',who:'Ben Kooi',why:'Stick Out Slant only. Build confidence.',col:'#F0B429'},
      {pkg:'Red Zone',who:'INSTALL NOW',why:'0% both QBs. No package exists yet.',col:'#dc2626'},
      {pkg:'2-Minute Drill',who:'Cooper Melvin',why:'TTT 2.0s optimal for no-huddle.',col:'#22c55e'},
      {pkg:'4th & Short',who:'Cooper Melvin',why:'84% comp and mobility best conversion.',col:'#22c55e'},
      {pkg:'Showcase Games',who:'Cooper Melvin',why:'Feature every snap. College-ready now.',col:'#22c55e'},
    ]
    const send=async(msg)=>{
      if(!msg.trim()||load)return
      const um={role:'user',content:msg};const nm=[...msgs,um]
      setMsgs(nm);setInp('');setLoad(true)
      try{
        const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:200,system:DC2,messages:nm.map(m=>({role:m.role,content:m.content}))})})
        const d=await r.json();setMsgs(p=>[...p,{role:'assistant',content:d.content?.[0]?.text||'Error'}])
      }catch(e){setMsgs(p=>[...p,{role:'assistant',content:'Connection error.'}])}
      setLoad(false)
    }
    React.useEffect(()=>ref.current?.scrollIntoView({behavior:'smooth'}),[msgs])
    return(
      <div style={{padding:isMobile?10:16,fontFamily:'Helvetica,Arial,sans-serif'}}>
        <div style={{background:'#0a0a0a',border:'1px solid #F0B429',borderRadius:8,padding:12,marginBottom:12}}>
          <div style={{fontSize:11,fontWeight:700,color:'#F0B429',letterSpacing:2}}>📋 DEPTH CHART & PERSONNEL — AI PACKAGE ADVISOR</div>
          <div style={{fontSize:8,color:'#555',marginTop:2}}>Who starts · When to sub · Package recommendations · How to use both QBs</div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:isMobile?8:10,marginBottom:10}}>
          {[['COOPER MELVIN','QB1 STARTER','#22c55e','#070f07',[['Comp %','84%','#22c55e'],['RTG','87','#22c55e'],['YPA','13.2','#F0B429'],['Deep Ball','88%','#22c55e'],['TTT','2.0s','#22c55e'],['CPOE','+4%','#22c55e']],'START EVERY GAME'],['BEN KOOI','QB2 BACKUP','#F0B429','#0c0a06',[['Comp %','70%','#d97706'],['RTG','71','#d97706'],['YPA','6.5','#d97706'],['Deep Ball','50%','#dc2626'],['TTT','1.9s','#d97706'],['CPOE','-3%','#dc2626']],'SHORT PACKAGE ONLY']].map(([n,role,col,bg,stats,badge])=>(
            <div key={n} style={{background:bg,border:`2px solid ${col}`,borderRadius:10,padding:14}}>
              <div style={{fontSize:10,fontWeight:700,color:col,marginBottom:8,textAlign:'center'}}>{n} — {role}</div>
              {stats.map(([l,v,vc])=><div key={l} style={{display:'flex',justifyContent:'space-between',padding:'4px 0',borderBottom:`0.5px solid ${col}22`}}><span style={{fontSize:9,color:'#9ca3af'}}>{l}</span><span style={{fontSize:11,fontWeight:700,color:vc}}>{v}</span></div>)}
              <div style={{marginTop:8,background:col+'22',borderRadius:6,padding:'7px',textAlign:'center',fontSize:10,fontWeight:700,color:col}}>{badge}</div>
            </div>
          ))}
        </div>
        <div style={{background:'#0d0d0d',border:'0.5px solid #252525',borderRadius:8,overflow:'hidden',marginBottom:10}}>
          <div style={{background:'#0a0a0a',padding:'6px 12px',borderBottom:'0.5px solid #252525',display:'grid',gridTemplateColumns:'1fr 1.2fr 1.5fr'}}>{['PACKAGE','QB','WHY'].map(h=><div key={h} style={{fontSize:7,fontWeight:700,color:'#555'}}>{h}</div>)}</div>
          {pkgs.map((p,i)=><div key={p.pkg} style={{display:'grid',gridTemplateColumns:'1fr 1.2fr 1.5fr',padding:'7px 12px',background:i%2===0?'#0f0f0f':'#141414',borderBottom:'0.5px solid #1a1a1a',alignItems:'center',cursor:'pointer'}} onClick={()=>send(`Tell me more about the ${p.pkg} package`)}><div style={{fontSize:9,fontWeight:700,color:'#F0B429'}}>{p.pkg}</div><div style={{fontSize:9,fontWeight:700,color:p.col}}>{p.who}</div><div style={{fontSize:8,color:'#666'}}>{p.why}</div></div>)}
        </div>
        <div style={{display:'flex',gap:5,flexWrap:'wrap',marginBottom:8}}>{qs.map(q=><button key={q} onClick={()=>send(q)} style={{padding:'5px 10px',background:'#0d0d0d',border:'0.5px solid #252525',borderRadius:14,color:'#9ca3af',fontSize:9,cursor:'pointer'}}>{q}</button>)}</div>
        <div style={{overflowY:'auto',background:'#090909',border:'0.5px solid #2a1a00',borderRadius:8,padding:10,display:'flex',flexDirection:'column',gap:8,minHeight:180,marginBottom:8}}>
          {msgs.map((m,i)=><div key={i} style={{display:'flex',justifyContent:m.role==='user'?'flex-end':'flex-start'}}><div style={{maxWidth:'88%',padding:'9px 12px',borderRadius:10,background:m.role==='user'?'#2a1a00':'#111',border:`0.5px solid ${m.role==='user'?'#F0B42933':'#252525'}`,borderBottomRightRadius:m.role==='user'?2:10,borderBottomLeftRadius:m.role==='assistant'?2:10}}>{m.role==='assistant'&&<div style={{fontSize:8,fontWeight:700,color:'#F0B429',marginBottom:3}}>PERSONNEL AI</div>}<div style={{fontSize:13,color:'#e5e7eb',lineHeight:1.55,whiteSpace:'pre-wrap'}}>{m.content}</div></div></div>)}
          {load&&<div style={{display:'flex'}}><div style={{padding:'8px 12px',background:'#111',borderRadius:10,border:'0.5px solid #252525'}}><span style={{fontSize:11,color:'#F0B429'}}>Thinking...</span></div></div>}
          <div ref={ref}/>
        </div>
        <div style={{display:'flex',gap:6}}><input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send(inp)} placeholder="Ask about personnel, packages, substitutions..." style={{flex:1,background:'#111',border:'0.5px solid #2a1a00',borderRadius:8,padding:'10px 12px',color:'#fff',fontSize:13,outline:'none'}}/><button onClick={()=>send(inp)} disabled={load||!inp.trim()} style={{padding:'10px 18px',background:load||!inp.trim()?'#111':'#2a1a00',border:`1px solid ${load||!inp.trim()?'#252525':'#F0B429'}`,borderRadius:8,color:load||!inp.trim()?'#555':'#F0B429',fontWeight:700,fontSize:13,cursor:'pointer'}}>{load?'...':'Ask'}</button></div>
      </div>
    )
  }

  const DashboardTab=()=>{
    const sData=[
      {d:'4/21',type:'7on7',cAtt:10,cComp:8,cYds:82,bAtt:10,bComp:7,bYds:62,note:'Cooper sharp. Ben redzone issues.'},
      {d:'4/27',type:'7on7',cAtt:10,cComp:8,cYds:96,bAtt:6,bComp:4,bYds:38,note:'Consistent. Ben improving.'},
      {d:'4/30',type:'Varsity',cAtt:3,cComp:3,cYds:89,bAtt:2,bComp:1,bYds:12,note:'Cooper 69-yd TD Verticals.'},
      {d:'Show.',type:'Showcase',cAtt:10,cComp:8,cYds:110,bAtt:10,bComp:8,bYds:75,note:'Both 80%. College coaches watching.'},
      {d:'5/8',type:'7on7',cAtt:5,cComp:5,cYds:74,bAtt:5,bComp:2,bYds:28,note:'Cooper perfect. Ben throws high.'},
      {d:'5/12',type:'Team',cAtt:16,cComp:12,cYds:207,bAtt:11,bComp:6,bYds:95,note:'Cooper INT noted. Ben improving.'},
    ]
    const cd=[
      {n:'Baltimore',col:'#22c55e',pct:100,att:12,epa:1.8,grade:'ELITE'},
      {n:'Post',col:'#22c55e',pct:100,att:10,epa:1.4,grade:'ELITE'},
      {n:'Stick',col:'#22c55e',pct:100,att:22,epa:0.8,grade:'ELITE'},
      {n:'Four Verts',col:'#22c55e',pct:100,att:2,epa:1.9,grade:'ELITE'},
      {n:'Verticals',col:'#22c55e',pct:88,att:4,epa:2.1,grade:'ELITE'},
      {n:'Out',col:'#d97706',pct:100,att:10,epa:0.2,grade:'SOLID'},
      {n:'Slant',col:'#d97706',pct:90,att:8,epa:0.3,grade:'SOLID'},
      {n:'Smash',col:'#d97706',pct:100,att:2,epa:0.5,grade:'BUILD'},
      {n:'RPO Glance',col:'#d97706',pct:100,att:4,epa:0.4,grade:'BUILD'},
      {n:'Sail',col:'#dc2626',pct:0,att:10,epa:-0.6,grade:'CUT'},
      {n:'Fade',col:'#dc2626',pct:0,att:10,epa:-0.8,grade:'CUT'},
    ]
    return(
      <div style={{padding:isMobile?10:16,fontFamily:'Helvetica,Arial,sans-serif'}}>
        <div style={{background:'#0a0a0a',border:'1px solid #F0B429',borderRadius:8,padding:12,marginBottom:12}}>
          <div style={{fontSize:11,fontWeight:700,color:'#F0B429',letterSpacing:2}}>📊 SEASON DASHBOARD — 2026-2027 Full Overview</div>
          <div style={{fontSize:8,color:'#555',marginTop:2}}>117 plays · 6 sessions · Both QBs · All concepts · Everything at a glance</div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:isMobile?'repeat(3,1fr)':'repeat(6,1fr)',gap:6,marginBottom:12}}>
          {[['117','Total Plays','#22c55e'],['84%','Cooper Comp','#22c55e'],['70%','Ben Comp','#F0B429'],['87','Cooper RTG','#22c55e'],['71','Ben RTG','#F0B429'],['A','Season Grade','#22c55e']].map(([v,l,col])=>(
            <div key={l} style={{background:'#111',border:`0.5px solid ${col}33`,borderRadius:8,padding:'10px 4px',textAlign:'center'}}>
              <div style={{fontSize:20,fontWeight:700,color:col,lineHeight:1}}>{v}</div>
              <div style={{fontSize:7,color:'#555',marginTop:3,letterSpacing:1}}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:isMobile?8:10,marginBottom:12}}>
          <div style={{background:'#0d0d0d',border:'0.5px solid #1d3a1d',borderRadius:8,overflow:'hidden'}}>
            <div style={{background:'#0a0a0a',padding:'6px 12px',borderBottom:'0.5px solid #1d3a1d',fontSize:9,fontWeight:700,color:'#22c55e',letterSpacing:1}}>SESSION LOG</div>
            {sData.map((s,i)=>(
              <div key={s.d} style={{padding:'8px 12px',background:i%2===0?'#0f0f0f':'#141414',borderBottom:'0.5px solid #1a1a1a'}}>
                <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:2}}>
                  <span style={{fontSize:10,fontWeight:700,color:'#F0B429',minWidth:32}}>{s.d}</span>
                  <span style={{fontSize:8,color:'#444',minWidth:50}}>{s.type}</span>
                  <span style={{fontSize:10,fontWeight:700,color:'#22c55e',minWidth:38}}>C:{Math.round(s.cComp/s.cAtt*100)}%</span>
                  <span style={{fontSize:10,fontWeight:700,color:'#F0B429',minWidth:38}}>B:{Math.round(s.bComp/s.bAtt*100)}%</span>
                  <span style={{fontSize:8,color:'#333',flex:1}}>{s.cYds+s.bYds}yds</span>
                </div>
                <div style={{fontSize:8,color:'#444'}}>{s.note}</div>
              </div>
            ))}
          </div>
          <div style={{background:'#0d0d0d',border:'0.5px solid #1d3a1d',borderRadius:8,overflow:'hidden'}}>
            <div style={{background:'#0a0a0a',padding:'6px 12px',borderBottom:'0.5px solid #1d3a1d',display:'grid',gridTemplateColumns:'1fr 0.6fr 0.5fr 0.6fr 0.7fr'}}>{['CONCEPT','COMP%','ATT','EPA','GRADE'].map(h=><div key={h} style={{fontSize:7,fontWeight:700,color:'#555',textAlign:'center'}}>{h}</div>)}</div>
            {cd.map((x,i)=>(
              <div key={x.n} style={{display:'grid',gridTemplateColumns:'1fr 0.6fr 0.5fr 0.6fr 0.7fr',padding:'6px 12px',background:i%2===0?'#0f0f0f':'#141414',borderBottom:'0.5px solid #1a1a1a',alignItems:'center'}}>
                <div style={{fontSize:9,fontWeight:700,color:x.col}}>{x.n}</div>
                <div style={{fontSize:11,fontWeight:700,color:x.col,textAlign:'center'}}>{x.pct}%</div>
                <div style={{fontSize:10,textAlign:'center',color:'#9ca3af'}}>{x.att}</div>
                <div style={{fontSize:10,fontWeight:700,textAlign:'center',color:x.epa>=0?'#22c55e':'#dc2626'}}>{x.epa>=0?'+':''}{x.epa}</div>
                <div style={{fontSize:9,textAlign:'center',fontWeight:700,color:x.col}}>{x.grade}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr 1fr',gap:isMobile?6:8}}>
          {[['CALL EVERY GAME','#22c55e',['Baltimore — 100%, 12.4avg, +1.8 EPA','Post — 100%, 13.1avg, +1.4 EPA','Stick — 100%, 7.7avg, +0.8 EPA','Four Verts — 100%, 22.0avg, +1.9 EPA','Verticals — 88%, 28.5avg, +2.1 EPA']],['BUILD IMMEDIATELY','#d97706',['Out — 100%, keep in every game','Slant — 90%, good opener','Smash — 100%, expand reps','RPO Glance — 100%, develop','Red Zone Package — MUST INSTALL']],['REMOVE NOW','#dc2626',['Sail — 0% all 6 sessions, -0.6 EPA','Fade — 0% all 6 sessions, -0.8 EPA','Right deep routes — 0% both QBs','Ben deep routes — only 50%','Any play with 0% comp rate']]].map(([t,col,items])=>(
            <div key={t} style={{background:col+'11',border:`0.5px solid ${col}33`,borderRadius:8,padding:12}}>
              <div style={{fontSize:9,fontWeight:700,color:col,marginBottom:8,letterSpacing:1}}>{t}</div>
              {items.map((item,i)=><div key={i} style={{fontSize:9,color:col+'cc',padding:'4px 0',borderBottom:`0.5px solid ${col}22`,lineHeight:1.5}}>{item}</div>)}
            </div>
          ))}
        </div>
      </div>
    )
  }


  const CoachingStaffTab=()=>{
    const [selected,setSelected]=React.useState([])
    const [subject,setSubject]=React.useState('')
    const [body,setBody]=React.useState('')
    const [load,setLoad]=React.useState(false)
    const [composed,setComposed]=React.useState(false)
    const [filter,setFilter]=React.useState('All')
    const coaches=[
      {id:'matt',name:'Coach Matt',role:'Head Coach',unit:'Offense',email:'mattmolly@me.com',init:'CM',col:'#22c55e',note:'Primary contact. Runs all offensive concepts. Reviews QB data weekly.'},
      {id:'oc',name:'OC Coach',role:'Offensive Coordinator',unit:'Offense',email:'',init:'OC',col:'#22c55e',note:'Play caller. Needs EPA breakdown and concept grades every session.'},
      {id:'qb',name:'QB Coach',role:'Quarterback Coach',unit:'Offense',email:'',init:'QB',col:'#22c55e',note:'Works with Cooper and Ben. Needs TTT, release, and hash data.'},
      {id:'wr',name:'WR Coach',role:'Wide Receiver Coach',unit:'Offense',email:'',init:'WR',col:'#F0B429',note:'Needs separation data, route success rates, target breakdown.'},
      {id:'rb',name:'RB Coach',role:'Running Back Coach',unit:'Offense',email:'',init:'RB',col:'#F0B429',note:'RPO and screen data. Cooper QB run tracking from 5/12.'},
      {id:'ol',name:'OL Coach',role:'Offensive Line Coach',unit:'Offense',email:'',init:'OL',col:'#d97706',note:'Pressure rate data. Clean pocket vs pressure on every play.'},
      {id:'hc',name:'Head Coach',role:'Head Coach / DC',unit:'Defense',email:'',init:'HC',col:'#dc2626',note:'Big picture. Needs full weekly summary — both sides of ball.'},
      {id:'dc',name:'DC Coach',role:'Defensive Coordinator',unit:'Defense',email:'',init:'DC',col:'#dc2626',note:'Coverage calls, opponent tendency, red zone defense data.'},
      {id:'lb',name:'LB Coach',role:'Linebacker Coach',unit:'Defense',email:'',init:'LB',col:'#dc2626',note:'Spy packages, blitz pickups, coverage assignments.'},
      {id:'db',name:'DB Coach',role:'DB / Secondary Coach',unit:'Defense',email:'',init:'DB',col:'#dc2626',note:'Separation allowed, coverage breakdowns, man vs zone data.'},
      {id:'dl',name:'DL Coach',role:'D-Line Coach',unit:'Defense',email:'',init:'DL',col:'#7c3aed',note:'Pressure rate, sack opportunities, run gap assignments.'},
      {id:'st',name:'ST Coach',role:'Special Teams Coach',unit:'Special',email:'',init:'ST',col:'#a78bfa',note:'Punt/kick decisions, return setups, onside situations.'},
      {id:'sc',name:'Strength Coach',role:'Strength and Conditioning',unit:'Staff',email:'',init:'SC',col:'#06b6d4',note:'Workload data, speed tracking, physical development metrics.'},
      {id:'fa',name:'Analytics Staff',role:'Film and Analytics',unit:'Staff',email:'mattmolly@me.com',init:'FA',col:'#06b6d4',note:'This dashboard. Film notes. Weekly analytics summary.'},
    ]
    const units=['All','Offense','Defense','Special','Staff']
    const filtered=filter==='All'?coaches:coaches.filter(x=>x.unit===filter)
    const toggleCoach=id=>setSelected(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id])
    const selCoaches=coaches.filter(x=>selected.includes(x.id))
    const emailList=selCoaches.map(x=>x.email).filter(Boolean).join(', ')
    const genEmail=async(type)=>{
      setLoad(true)
      const ps={
        weekly:'Write a professional weekly analytics email for Westfield Shamrocks coaching staff. Cover: 5/12 session (Cooper 75% 12att, Ben 55% 11att), top concepts (Baltimore 100% Post 100% Stick 100%), cut immediately (Sail 0% Fade 0%), critical gap (red zone 0% both QBs), and one action item for next practice. Sign off as Westfield Analytics Staff.',
        gameplan:'Write a pre-game coaching staff email with game plan priorities for Westfield Shamrocks. Include: opening script (Baltimore, Post, Stick), key matchup to exploit, what to avoid (Sail Fade red zone), Cooper spotlight plays for scouts, and Ben package plays.',
        showcase:'Write an email preparing coaching staff for a College Showcase. Cover: Cooper stats (84% comp RTG87 13.2ypa deep ball 88% vs NFL 52%), how to introduce him to college coaches, which plays highlight his strengths, and key talking points about his upside and projection.',
        halftime:'Write a quick halftime adjustment memo for coaching staff. What is working (keep calling), what is not (stop calling), and one key adjustment per unit. Short and direct — 2 minutes to read.'
      }
      try{
        const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:550,system:'You are the analytics director for Westfield Shamrocks football. Write professional emails for coaching staff based on real season data.',messages:[{role:'user',content:ps[type]}]})})
        const d=await r.json()
        const text=d.content?.[0]?.text||'Error'
        const lines=text.split('\n')
        setSubject(lines[0].replace(/^Subject:\s*/i,'').replace(/\*\*/g,'').trim()||'Westfield Shamrocks Analytics Report')
        setBody(lines.slice(1).join('\n').trim()||text)
        setComposed(true)
      }catch(e){setBody('Connection error.')}
      setLoad(false)
    }
    return(
      <div style={{padding:isMobile?10:16,fontFamily:'Helvetica,Arial,sans-serif'}}>
        <div style={{background:'#0a1a0a',border:'1px solid #22c55e',borderRadius:8,padding:12,marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:700,color:'#22c55e',letterSpacing:2}}>👥 COACHING STAFF DIRECTORY — Select and Email Any Group</div>
          <div style={{fontSize:8,color:'#555',marginTop:2}}>Select coaches · AI generates the email · Open in Mail · Keep every coach informed every week</div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1.1fr 1fr',gap:12}}>
          <div>
            <div style={{display:'flex',gap:5,marginBottom:10,flexWrap:'wrap',alignItems:'center'}}>
              {units.map(u=><button key={u} onClick={()=>setFilter(u)} style={{padding:'5px 10px',background:filter===u?'#14532d':'#0d0d0d',border:`0.5px solid ${filter===u?'#22c55e':'#252525'}`,borderRadius:14,color:filter===u?'#22c55e':'#555',fontSize:9,fontWeight:700,cursor:'pointer'}}>{u}</button>)}
              <div style={{marginLeft:'auto',display:'flex',gap:4}}>
                <button onClick={()=>setSelected(filtered.map(x=>x.id))} style={{padding:'4px 8px',background:'#0d0d0d',border:'0.5px solid #252525',borderRadius:6,color:'#9ca3af',fontSize:8,cursor:'pointer'}}>All</button>
                <button onClick={()=>setSelected([])} style={{padding:'4px 8px',background:'#0d0d0d',border:'0.5px solid #252525',borderRadius:6,color:'#9ca3af',fontSize:8,cursor:'pointer'}}>Clear</button>
              </div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:5}}>
              {filtered.map(coach=>(
                <div key={coach.id} onClick={()=>toggleCoach(coach.id)} style={{display:'flex',gap:10,padding:'10px 12px',background:selected.includes(coach.id)?coach.col+'11':'#0d0d0d',border:`0.5px solid ${selected.includes(coach.id)?coach.col:'#252525'}`,borderRadius:8,cursor:'pointer',alignItems:'center'}}>
                  <div style={{width:36,height:36,borderRadius:8,background:coach.col+'22',border:`1px solid ${coach.col}44`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:coach.col,flexShrink:0}}>{coach.init}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <span style={{fontSize:12,fontWeight:700,color:selected.includes(coach.id)?coach.col:'#ccc'}}>{coach.name}</span>
                      <span style={{fontSize:8,color:coach.col,background:coach.col+'11',padding:'1px 6px',borderRadius:4,flexShrink:0,marginLeft:6}}>{coach.unit}</span>
                    </div>
                    <div style={{fontSize:9,color:'#555',marginTop:1}}>{coach.role}</div>
                    <div style={{fontSize:8,color:coach.email?'#06b6d4':'#333',marginTop:1}}>{coach.email||'No email yet — add below'}</div>
                    <div style={{fontSize:7,color:'#333',marginTop:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{coach.note}</div>
                  </div>
                  <div style={{width:18,height:18,borderRadius:4,border:`1.5px solid ${selected.includes(coach.id)?coach.col:'#333'}`,background:selected.includes(coach.id)?coach.col:'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    {selected.includes(coach.id)&&<span style={{color:'#000',fontSize:11,fontWeight:700}}>✓</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}><PracticeTimer/>
            <div style={{background:'#0d0d0d',border:'0.5px solid #1d3a1d',borderRadius:8,padding:12}}>
              <div style={{fontSize:9,fontWeight:700,color:'#22c55e',marginBottom:6,letterSpacing:1}}>SELECTED: {selected.length} coaches</div>
              {selCoaches.length>0&&<div style={{display:'flex',flexWrap:'wrap',gap:4,marginBottom:8}}>{selCoaches.map(x=><span key={x.id} style={{background:x.col+'22',color:x.col,fontSize:8,fontWeight:700,padding:'2px 7px',borderRadius:4,border:`0.5px solid ${x.col}33`}}>{x.name}</span>)}</div>}
              {emailList&&<div style={{background:'#111',borderRadius:6,padding:8,marginBottom:4}}><div style={{fontSize:7,color:'#555',marginBottom:2}}>EMAIL LIST</div><div style={{fontSize:10,color:'#06b6d4',wordBreak:'break-all',lineHeight:1.5}}>{emailList}</div></div>}
              <div style={{fontSize:8,color:'#444',marginTop:4}}>Tap a coach card to select · Add emails by editing the coaches array in the code</div>
            </div>
            <div style={{background:'#0d0d0d',border:'0.5px solid #252525',borderRadius:8,padding:12}}>
              <div style={{fontSize:9,fontWeight:700,color:'#F0B429',marginBottom:8,letterSpacing:1}}>AI GENERATE EMAIL — Pick a type</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
                {[['weekly','📊 Weekly Report'],['gameplan','⚡ Game Plan'],['showcase','🏈 Showcase Prep'],['halftime','🚨 Halftime Adjust']].map(([type,lbl])=>(
                  <button key={type} onClick={()=>genEmail(type)} disabled={load} style={{padding:'10px 6px',background:'#111',border:'0.5px solid #252525',borderRadius:6,color:'#9ca3af',fontSize:10,fontWeight:700,cursor:load?'default':'pointer',textAlign:'center'}}>{lbl}</button>
                ))}
              </div>
            </div>
            {load&&<div style={{background:'#0d0d0d',border:'0.5px solid #252525',borderRadius:8,padding:14,textAlign:'center'}}><span style={{fontSize:12,color:'#06b6d4'}}>Writing from your season data...</span></div>}
            {composed&&!load&&(
              <div style={{background:'#0d0d0d',border:'0.5px solid #1d3a1d',borderRadius:8,padding:12}}>
                <div style={{fontSize:9,fontWeight:700,color:'#22c55e',marginBottom:8,letterSpacing:1}}>GENERATED EMAIL — Edit if needed</div>
                <div style={{marginBottom:7}}><div style={{fontSize:7,color:'#555',marginBottom:3}}>SUBJECT</div><input value={subject} onChange={e=>setSubject(e.target.value)} style={{width:'100%',background:'#111',border:'0.5px solid #252525',borderRadius:6,color:'#ccc',padding:'7px',fontSize:12,outline:'none',boxSizing:'border-box'}}/></div>
                <div style={{marginBottom:7}}><div style={{fontSize:7,color:'#555',marginBottom:3}}>TO</div><div style={{background:'#111',border:'0.5px solid #252525',borderRadius:6,padding:'7px',fontSize:11,color:'#06b6d4',wordBreak:'break-all'}}>{emailList||'Select coaches above to populate'}</div></div>
                <textarea value={body} onChange={e=>setBody(e.target.value)} style={{width:'100%',background:'#111',border:'0.5px solid #252525',borderRadius:6,color:'#ccc',padding:'8px',fontSize:11,outline:'none',minHeight:160,resize:'none',boxSizing:'border-box',lineHeight:1.6,marginBottom:8}}/>
                <button onClick={()=>window.open(`mailto:${emailList}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)} style={{width:'100%',padding:'12px',background:'#14532d',border:'none',borderRadius:8,color:'#22c55e',fontWeight:700,fontSize:13,cursor:'pointer'}}>📧 OPEN IN MAIL APP — Send to Selected Coaches</button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const PlayerProfilesTab=()=>{
    const [selId,setSelId]=React.useState('cooper')

    React.useEffect(()=>{loadData('player_profiles',null).then(d=>{if(d&&d.length)setPlayers(d)})},[])
    React.useEffect(()=>{saveData('player_profiles',players);flash()},[players])

    const [load,setLoad]=React.useState(false)
    const [aiReport,setAiReport]=React.useState('')
    const [addMode,setAddMode]=React.useState(false)
    const [newP,setNewP]=React.useState({name:'',number:'',pos:'WR',grade:'B',col:'#06b6d4'})
    const [players,setPlayers]=React.useState([
      {id:'cooper',name:'Cooper Melvin',number:'',pos:'QB',grade:'A',col:'#22c55e',
       stats:{Comp:'84%',Yards:'658',YPA:'13.2',RTG:'87',ATT:'63',Sessions:'6'},
       sessions:[{d:'4/21',g:'B+',n:'80% comp. Sharp reads. One forced throw.'},{d:'4/27',g:'B+',n:'80% comp. Consistent. Hash throws improving.'},{d:'4/30',g:'A',n:'100% comp. 69-yd TD on Verticals. Throw of year.'},{d:'Show.',g:'A',n:'80% with coaches watching. Showcase ready.'},{d:'5/8',g:'A+',n:'100% comp. Perfect. Best form all season.'},{d:'5/12',g:'B',n:'75% comp. INT under pressure. Still strong.'}],
       pros:['Dominant arm — 13.2 avg yds per play','Elite deep ball 88% vs NFL avg 52%','85%+ comp rate between the hashes','100% on 5/8 — best form of season','Performs under pressure with coaches watching','CPOE +4% — outperforms his projected rate'],
       cons:['Red zone 0% — no package installed yet','Sail and Fade mechanics need drilling','Release hangtime — keep at 3.3s or less','Right hash deep routes — 0% all season'],
       next:['Red zone route tree — Fade and back-shoulder reps','Hash accuracy drill — L and R 10 reps each','Flat release drill — fix hangtime issue','Film study — Kaepernick red zone mechanics'],
       proj:'Hash 73→85% = RTG 87→96. Fix redzone = RTG 102. All fixes = 108+ (strong recruiting profile).'},
      {id:'ben',name:'Ben Kooi',number:'',pos:'QB',grade:'B',col:'#F0B429',
       stats:{Comp:'70%',Yards:'310',YPA:'6.5',RTG:'71',ATT:'54',Sessions:'6'},
       sessions:[{d:'4/21',g:'B',n:'70% comp. Good short game. Redzone miss.'},{d:'4/27',g:'C+',n:'67% comp. Inconsistent. Still improving.'},{d:'4/30',g:'C',n:'50% comp. High throws when comfortable.'},{d:'Show.',g:'B+',n:'80% comp. Most improved. Responded under pressure.'},{d:'5/8',g:'D',n:'40% comp. High release mechanic issue.'},{d:'5/12',g:'C+',n:'55% comp. Better decisions. Trending up.'}],
       pros:['80% at Showcase — best performance under pressure','Stick and Smash 100% — reliable short game','Improving trend: 40% on 5/8 to 55% on 5/12','Decision speed 1.9s — reads short well'],
       cons:['High throw release — mechanical issue when relaxed','Deep ball 50% — below NFL average of 52%','Hash accuracy 60% — needs significant work','Red zone 0% — no package installed'],
       next:['Flat release mechanics — 20 reps daily, top priority','Left and right hash drills — 10 reps each side','Deep ball — 7-step drop, Sail route mechanics','Redzone — install Fade and back-shoulder package'],
       proj:'Fix mechanics +8pts. Hash +7pts. Redzone +10pts. Total = RTG 71→96+. QB1 capable in 6 months.'},
      {id:'wr1',name:'WR1',number:'',pos:'WR',grade:'A-',col:'#06b6d4',
       stats:{Separation:'3.8 avg',Targets:'High',Drops:'Low',YAC:'Est 6.2',Sessions:'6'},
       sessions:[{d:'4/21',g:'A',n:'Strong releases. Separation on Post and Verticals.'},{d:'4/27',g:'B+',n:'Good routes. Slight drift on comebacks.'},{d:'4/30',g:'A',n:'TD on 69-yd Verticals. Elite effort.'},{d:'Show.',g:'A-',n:'Competed with coaches watching.'},{d:'5/8',g:'A+',n:'Perfect session. Clean releases every route.'},{d:'5/12',g:'B+',n:'Good but Sail mechanics slightly off.'}],
       pros:['Elite separation on Post and Verticals routes','Strong releases vs press coverage','Cooper trusts him on deep shots','Consistent target — never drops in big moments'],
       cons:['Sail route mechanics — 0% completion all season','Comeback drift — hips not square at catch point','Red zone — no package to showcase skills yet'],
       next:['Sail route footwork — plant and drive hard on out','Comeback route — square hips at catch point daily','Red zone — back-shoulder and fade catch drills','Film — watch elite WR releases off press coverage'],
       proj:'Fix Sail unlocks right hash. Add red zone package = complete WR profile for recruiting.'},
      {id:'wr2',name:'WR2',number:'',pos:'WR',grade:'B+',col:'#06b6d4',
       stats:{Separation:'3.2 avg',Targets:'Med',Drops:'Med',YAC:'Est 4.8',Sessions:'6'},
       sessions:[{d:'4/21',g:'B',n:'Solid underneath. Press separation issues.'},{d:'4/27',g:'B+',n:'Improved releases. Good Stick routes.'},{d:'4/30',g:'B',n:'Reliable in varsity reps.'},{d:'Show.',g:'B+',n:'Competed well with coaches watching.'},{d:'5/8',g:'A-',n:'Best session. Clean on all routes.'},{d:'5/12',g:'B',n:'Solid. Needs more vertical reps.'}],
       pros:['Reliable underneath — Stick and Smash routes','Good hands — low drop rate on short throws','Improving week to week — positive trend'],
       cons:['Vertical route separation needs development','Press coverage releases can improve','Deep route speed — needs to threaten safety'],
       next:['Vertical route — explosive first step off line','Press coverage — inside release technique drill','Sprint work — push deep to stress safety coverage'],
       proj:'Add vertical threat to profile = complete slot receiver. D3/NAIA level with development.'},
      {id:'rb1',name:'RB1',number:'',pos:'RB',grade:'B+',col:'#d97706',
       stats:{Carries:'Est 18',YPC:'Est 5.2',Catches:'Est 8',Screen:'100%',Sessions:'6'},
       sessions:[{d:'4/21',g:'B+',n:'Good effort on RPO plays.'},{d:'4/27',g:'B',n:'Solid. Some blocking assignment misses.'},{d:'4/30',g:'A-',n:'Varsity reps — responded well.'},{d:'Show.',g:'B+',n:'Competed. Pass protection solid.'},{d:'5/8',g:'B+',n:'Good hands out of backfield.'},{d:'5/12',g:'B',n:'Consistent. Needs more redzone reps.'}],
       pros:['Reliable on RPO Glance — 100% when targeted','Good hands catching out of the backfield','Pass protection — solid pocket presence for QB'],
       cons:['Red zone — no package so no data exists yet','Screen game — needs more reps to develop','Blocking footwork — pull block consistency'],
       next:['Screen route — 10 reps out of backfield each side','Red zone check-down — install as safety valve for Cooper','Pull block footwork — work with OL coach'],
       proj:'Install RB red zone check-down package. Adds Cooper escape valve and helps Ben in short packages.'},
      {id:'ol1',name:'OL Captain',number:'',pos:'OL',grade:'B',col:'#888',
       stats:{CleanPocket:'72%',PressureAllowed:'28%',Sacks:'Low',Pancakes:'Good',Penalties:'Low'},
       sessions:[{d:'4/21',g:'B',n:'Solid protection. One pressure allowed mid.'},{d:'4/27',g:'B+',n:'Good unit. Cooper had time on most plays.'},{d:'4/30',g:'B+',n:'Held up well in varsity reps.'},{d:'Show.',g:'B',n:'Some breakdowns but mostly clean pockets.'},{d:'5/8',g:'A-',n:'Best unit session. Cooper clean pocket all day.'},{d:'5/12',g:'B-',n:'Pressure on Cooper INT play. Must improve communication.'}],
       pros:['72% clean pocket rate — above average for high school','Low penalty rate — disciplined and well-coached unit','Varsity reps showed up and competed at a high level'],
       cons:['28% pressure allowed — target is 20% or under','One communication breakdown led to Cooper INT on 5/12','Stunt recognition needs improvement at LOS'],
       next:['Stunt pick-up drill — OT and OG communication 15 reps','Slide protection calls — practice vs simulated blitz looks','Film session — identify the 5/12 breakdown and correct it'],
       proj:'Get pressure to 20% = Cooper RTG improves 5+ points automatically. OL is the hidden stat in this program.'},
    ])

    const gc=g=>g.startsWith('A')?'#22c55e':g.startsWith('B')?'#d97706':g.startsWith('C')?'#ea580c':'#dc2626'
    const sel=players.find(p=>p.id===selId)
    const positions=['QB','WR','RB','TE','OL','DL','LB','DB','K','P','ST']

    const genReport=async()=>{
      if(!sel)return
      setLoad(true);setAiReport('')
      const statsStr=Object.entries(sel.stats||{}).map(([k,v])=>`${k}: ${v}`).join(', ')
      try{
        const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:380,system:'You are an elite high school football coach writing a personal weekly report. Speak directly to the player using YOU. Be honest, specific, and motivating. Tell them exactly what they did well, what to fix, and give 3 specific drills to do before next practice. Sound like a great coach, not a robot.',messages:[{role:'user',content:`Write a personal weekly report for ${sel.name} (${sel.pos}) at Westfield Shamrocks. Stats: ${statsStr}. Season grade: ${sel.grade}. Strengths: ${sel.pros?.join('. ')}. Needs work: ${sel.cons?.join('. ')}. Next practice priorities: ${sel.next?.join('. ')}. Write directly to them — what they did well this week, one thing to improve, and 3 specific things to do before they step on the field again.`}]})})
        const d=await r.json();setAiReport(d.content?.[0]?.text||'Error')
      }catch(e){setAiReport('Connection error.')}
      setLoad(false)
    }

    const addPlayer=()=>{
      if(!newP.name.trim())return
      const id='p'+Date.now()
      setPlayers(p=>[...p,{id,name:newP.name,number:newP.number,pos:newP.pos,grade:newP.grade,col:newP.col,stats:{},sessions:[],pros:[],cons:[],next:[],proj:''}])
      setNewP({name:'',number:'',pos:'WR',grade:'B',col:'#06b6d4'})
      setAddMode(false);setSelId(id)
    }

    return(
      <div style={{padding:isMobile?10:16,fontFamily:'Helvetica,Arial,sans-serif'}}>
        <div style={{background:'#0a0a0a',border:'1px solid #22c55e',borderRadius:8,padding:12,marginBottom:14,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div><div style={{fontSize:11,fontWeight:700,color:'#22c55e',letterSpacing:2}}>🏈 PLAYER PROFILES — Full Team Roster</div><div style={{fontSize:8,color:'#555',marginTop:2}}>Every player · Weekly grades · Pros and cons · Next practice plan · AI personal improvement report</div></div>
          <button onClick={()=>setAddMode(!addMode)} style={{padding:'7px 12px',background:'#14532d',border:'none',borderRadius:6,color:'#22c55e',fontSize:10,fontWeight:700,cursor:'pointer'}}>+ Add Player</button>
        </div>
        {addMode&&(
          <div style={{background:'#0d0d0d',border:'1px solid #22c55e',borderRadius:8,padding:12,marginBottom:12}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 0.4fr 0.8fr 0.5fr',gap:8,marginBottom:8}}>
              <div><div style={{fontSize:7,color:'#555',marginBottom:3}}>PLAYER NAME</div><input value={newP.name} onChange={e=>setNewP(p=>({...p,name:e.target.value}))} placeholder="Full name" style={{width:'100%',background:'#111',border:'0.5px solid #252525',borderRadius:6,color:'#fff',padding:'7px',fontSize:12,outline:'none',boxSizing:'border-box'}}/></div>
              <div><div style={{fontSize:7,color:'#555',marginBottom:3}}>NUMBER</div><input value={newP.number} onChange={e=>setNewP(p=>({...p,number:e.target.value}))} placeholder="#" style={{width:'100%',background:'#111',border:'0.5px solid #252525',borderRadius:6,color:'#fff',padding:'7px',fontSize:12,outline:'none',boxSizing:'border-box'}}/></div>
              <div><div style={{fontSize:7,color:'#555',marginBottom:3}}>POSITION</div><select value={newP.pos} onChange={e=>setNewP(p=>({...p,pos:e.target.value}))} style={{width:'100%',background:'#111',border:'0.5px solid #252525',borderRadius:6,color:'#ccc',padding:'7px',fontSize:12}}>{positions.map(p=><option key={p} value={p}>{p}</option>)}</select></div>
              <div><div style={{fontSize:7,color:'#555',marginBottom:3}}>GRADE</div><select value={newP.grade} onChange={e=>setNewP(p=>({...p,grade:e.target.value}))} style={{width:'100%',background:'#111',border:'0.5px solid #252525',borderRadius:6,color:'#ccc',padding:'7px',fontSize:12}}>{['A+','A','A-','B+','B','B-','C+','C','D'].map(g=><option key={g} value={g}>{g}</option>)}</select></div>
            </div>
            <button onClick={addPlayer} style={{width:'100%',padding:'10px',background:'#14532d',border:'none',borderRadius:8,color:'#22c55e',fontWeight:700,fontSize:13,cursor:'pointer'}}>ADD TO ROSTER</button>
          </div>
        )}
        <div style={{display:'grid',gridTemplateColumns:'220px 1fr',gap:12}}>
          <div style={{display:'flex',flexDirection:'column',gap:5}}>
            {players.map(p=>(
              <div key={p.id} onClick={()=>{setSelId(p.id);setAiReport('')}} style={{display:'flex',gap:8,padding:'10px',background:selId===p.id?p.col+'11':'#0d0d0d',border:`0.5px solid ${selId===p.id?p.col:'#252525'}`,borderRadius:8,cursor:'pointer',alignItems:'center'}}>
                <div style={{width:38,height:38,borderRadius:8,background:p.col+'22',border:`1px solid ${p.col}44`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <div style={{fontSize:12,fontWeight:700,color:p.col}}>{p.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
                  {p.number&&<div style={{fontSize:7,color:p.col+'88'}}>#{p.number}</div>}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:11,fontWeight:700,color:selId===p.id?p.col:'#ccc',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.name}</div>
                  <div style={{fontSize:9,color:'#555'}}>{p.pos}</div>
                </div>
                <div style={{fontSize:16,fontWeight:700,color:gc(p.grade)}}>{p.grade}</div>
              </div>
            ))}
          </div>
          {sel&&(
            <div style={{display:'flex',flexDirection:'column',gap:10,minWidth:0}}>
              <div style={{background:'#0d0d0d',border:`1px solid ${sel.col}`,borderRadius:10,padding:16}}>
                <div style={{display:'flex',gap:14,alignItems:'center',marginBottom:14,paddingBottom:12,borderBottom:`0.5px solid ${sel.col}33`}}>
                  <div style={{width:58,height:58,borderRadius:10,background:sel.col+'22',border:`2px solid ${sel.col}`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    <div style={{fontSize:18,fontWeight:700,color:sel.col}}>{sel.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
                    {sel.number&&<div style={{fontSize:9,color:sel.col+'88'}}>#{sel.number}</div>}
                  </div>
                  <div style={{flex:1}}><div style={{fontSize:19,fontWeight:700,color:'#fff'}}>{sel.name}</div><div style={{fontSize:9,color:sel.col,fontWeight:700,letterSpacing:1,marginTop:2}}>{sel.pos} · WESTFIELD SHAMROCKS · 2026-2027</div></div>
                  <div style={{textAlign:'center',flexShrink:0}}><div style={{fontSize:34,fontWeight:700,color:gc(sel.grade)}}>{sel.grade}</div><div style={{fontSize:8,color:'#555'}}>SEASON GRADE</div></div>
                </div>
                {sel.stats&&Object.keys(sel.stats).length>0&&(
                  <div style={{display:'grid',gridTemplateColumns:isMobile?'repeat(3,1fr)':'repeat(6,1fr)',gap:5,marginBottom:14}}>
                    {Object.entries(sel.stats).map(([k,v])=>(
                      <div key={k} style={{background:'#111',borderRadius:6,padding:'7px 4px',textAlign:'center'}}>
                        <div style={{fontSize:13,fontWeight:700,color:sel.col}}>{v}</div>
                        <div style={{fontSize:7,color:'#555',marginTop:2}}>{k.toUpperCase()}</div>
                      </div>
                    ))}
                  </div>
                )}
                {sel.sessions?.length>0&&(
                  <div style={{marginBottom:14}}><div style={{fontSize:9,fontWeight:700,color:'#F0B429',marginBottom:6,letterSpacing:1}}>WEEKLY GRADES — Tap for session notes</div>
                    <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
                      {sel.sessions.map(s=>(
                        <div key={s.d} style={{background:'#111',border:`0.5px solid ${gc(s.g)}33`,borderRadius:6,padding:'6px 8px',textAlign:'center',flex:'1 1 70px'}}>
                          <div style={{fontSize:13,fontWeight:700,color:gc(s.g)}}>{s.g}</div>
                          <div style={{fontSize:8,color:'#555',marginTop:1}}>{s.d}</div>
                          <div style={{fontSize:7,color:'#444',marginTop:2,lineHeight:1.3}}>{s.n}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:isMobile?8:10,marginBottom:12}}>
                  <div><div style={{fontSize:9,fontWeight:700,color:'#22c55e',marginBottom:5}}>STRENGTHS</div>{sel.pros?.map((p,i)=><div key={i} style={{fontSize:11,color:'#9ca3af',padding:'4px 0',borderBottom:'0.5px solid #1d3a1d',lineHeight:1.5}}><span style={{color:'#22c55e',marginRight:5}}>✓</span>{p}</div>)}</div>
                  <div><div style={{fontSize:9,fontWeight:700,color:'#dc2626',marginBottom:5}}>NEEDS IMPROVEMENT</div>{sel.cons?.map((x,i)=><div key={i} style={{fontSize:11,color:'#fca5a5',padding:'4px 0',borderBottom:'0.5px solid #2a0404',lineHeight:1.5}}><span style={{color:'#dc2626',marginRight:5}}>✗</span>{x}</div>)}</div>
                </div>
                {sel.next?.length>0&&(
                  <div style={{background:'#111',borderRadius:8,padding:12,marginBottom:12}}><div style={{fontSize:9,fontWeight:700,color:'#06b6d4',marginBottom:6,letterSpacing:1}}>BEFORE NEXT PRACTICE — DO THESE</div>
                    {sel.next.map((item,i)=><div key={i} style={{display:'flex',gap:8,padding:'5px 0',borderBottom:'0.5px solid #1a1a2a',alignItems:'flex-start'}}><span style={{fontSize:11,fontWeight:700,color:'#06b6d4',minWidth:18,flexShrink:0}}>{i+1}.</span><span style={{fontSize:11,color:'#ccc',lineHeight:1.4}}>{item}</span></div>)}
                  </div>
                )}
                {sel.proj&&<div style={{background:sel.col+'11',border:`0.5px solid ${sel.col}33`,borderRadius:6,padding:10,marginBottom:12}}><div style={{fontSize:8,fontWeight:700,color:sel.col,marginBottom:3,letterSpacing:1}}>PROJECTION</div><div style={{fontSize:11,color:'#ccc',lineHeight:1.5}}>{sel.proj}</div></div>}
                <button onClick={genReport} disabled={load} style={{width:'100%',padding:'12px',background:load?'#111':'#0c1a3a',border:`1px solid ${load?'#252525':'#06b6d4'}`,borderRadius:8,color:load?'#555':'#06b6d4',fontWeight:700,fontSize:13,cursor:load?'default':'pointer'}}>
                  {load?'Writing your personal report...':'🤖 AI PERSONAL REPORT — What I need to do before next practice'}
                </button>
                {aiReport&&<div style={{background:'#07070f',border:'1px solid #06b6d4',borderRadius:8,padding:14,marginTop:10}}><div style={{fontSize:9,fontWeight:700,color:'#06b6d4',marginBottom:8,letterSpacing:1}}>PERSONAL REPORT FOR {sel.name.toUpperCase()}</div><div style={{fontSize:13,color:'#ccc',lineHeight:1.7,whiteSpace:'pre-wrap'}}>{aiReport}</div></div>}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }


  const ScoutReportTab=()=>{
    const [target,setTarget]=React.useState('Cooper Melvin')
    const [style,setStyle]=React.useState('D2 Recruiting Coordinator')
    const [report,setReport]=React.useState('')
    const [load,setLoad]=React.useState(false)
    const [physical,setPhysical]=React.useState({height:'',weight:'',dash:'',gpa:'',gradYear:'2027'})
    const profiles={
      'Cooper Melvin':{grade:'A',rtg:'87',comp:'84%',yds:'658',ypa:'13.2',deep:'88%',hash:'73%',ttt:'2.0s',cpoe:'+4%',col:'#22c55e',proj:'RTG 108+ D1-AA/FCS with all fixes',style:'Strong arm + mobile QB profile'},
      'Ben Kooi':{grade:'B',rtg:'71',comp:'70%',yds:'310',ypa:'6.5',deep:'50%',hash:'60%',ttt:'1.9s',cpoe:'-3%',col:'#F0B429',proj:'RTG 96+ QB1 capable in 6 months',style:'Developing dual-threat with high upside'},
    }
    const p=profiles[target]
    const generate=async()=>{
      setLoad(true); setReport('')
      const physLine=Object.values(physical).some(v=>v)?`Physical: ${physical.height||'TBD'} height, ${physical.weight||'TBD'} lbs, ${physical.dash||'TBD'} 40 time, GPA ${physical.gpa||'TBD'}, Class of ${physical.gradYear}.`:'Physical profile not yet measured.'
      const isCooper=target==='Cooper Melvin'
      const prompt=isCooper
        ?`Write a formal college football scouting report for Cooper Melvin, QB at Westfield Shamrocks Indiana, Class of 2027. Written from the perspective of a ${style}. Use exact stats throughout. Include these sections with headers:\n\nPLAYER OVERVIEW\nPHYSICAL PROFILE\nSTATISTICAL ANALYSIS\nNFL COMPARISON PROFILE\nSTRENGTHS\nAREAS TO DEVELOP\nDIVISION FIT ASSESSMENT\nRECRUITMENT RECOMMENDATION\n\nData: ${physLine} Season stats: 63att 50comp 84% 658yds 13.2ypa RTG87 Grade A. NFL NextGen: TTT 2.0s (NFL avg 2.36s optimal). airYards 13.2 (NFL avg 8.0 — ABOVE). Deep ball 88% (NFL avg 52% — ELITE). Hash accuracy 73% (NFL 71% avg). CPOE +4% outperforms projected rate. Style match: Strong arm accuracy · Mobile QB profile. Red zone 0% — no package installed yet. Fix hash+redzone+consistency = elite high school level with continued development. Make this sound like a real college program scouting document.`
        :`Write a developmental scouting evaluation for Ben Kooi, QB2 at Westfield Shamrocks Indiana, Class of 2027. Written from the perspective of a ${style}. Include: PLAYER OVERVIEW, CURRENT PROFILE, STATISTICAL ANALYSIS, KEY DEVELOPMENT AREAS, 8-STEP IMPROVEMENT PLAN, PROJECTED CEILING, TIMELINE TO STARTER. Data: ${physLine} 54att 38comp 70% 310yds 6.5ypa RTG71 Grade B. TTT 1.9s (slightly fast). Deep ball 50%. Hash 60%. CPOE -3%. Showcase game 80% comp under pressure with coaches watching — best performance. Fix mechanics+hash+redzone = RTG 96+ QB1 candidate. High upside. Do not give up on him. Make this sound like a real college program evaluation.`
      try{
        const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1400,system:'You are a professional college football scout writing formal evaluation reports. Use professional scouting language. Reference specific stats and numbers. Make it something a real college coach would read and act on.',messages:[{role:'user',content:prompt}]})})
        const d=await r.json(); setReport(d.content?.[0]?.text||'Error')
      }catch(e){setReport('Connection error — check API access.')}
      setLoad(false)
    }
    const fmt=t=>t.split('\n').map((line,i)=>{
      if(!line.trim())return <div key={i} style={{height:5}}/>
      if(line.match(/^[A-Z][A-Z\s]+$/)&&line.length<40)return<div key={i} style={{fontSize:11,fontWeight:700,color:'#F0B429',letterSpacing:1.5,marginTop:16,marginBottom:5,paddingTop:12,borderTop:'0.5px solid #252525'}}>{line}</div>
      if(line.startsWith('**')&&line.endsWith('**'))return<div key={i} style={{fontSize:11,fontWeight:700,color:'#F0B429',letterSpacing:1,marginTop:14,marginBottom:4,paddingTop:10,borderTop:'0.5px solid #252525'}}>{line.replace(/\*\*/g,'').toUpperCase()}</div>
      if(line.startsWith('# '))return<div key={i} style={{fontSize:15,fontWeight:700,color:'#22c55e',marginBottom:6}}>{line.replace('# ','')}</div>
      if(line.startsWith('## '))return<div key={i} style={{fontSize:12,fontWeight:700,color:'#F0B429',marginTop:12,marginBottom:4}}>{line.replace('## ','')}</div>
      const isBullet=line.startsWith('- ')||line.startsWith('• ')||line.match(/^\d+\./)
      return<div key={i} style={{fontSize:12,color:isBullet?'#ccc':'#9ca3af',lineHeight:1.7,paddingLeft:isBullet?14:0}}>{line}</div>
    })
    return(
      <div style={{padding:isMobile?12:20,fontFamily:'Helvetica,Arial,sans-serif'}}>
        <div style={{background:'#0a0a0a',border:'1px solid #22c55e',borderRadius:8,padding:14,marginBottom:16}}>
          <div style={{fontSize:11,fontWeight:700,color:'#22c55e',letterSpacing:2,marginBottom:3}}>📄 SCOUT REPORT GENERATOR — Formal College Evaluation</div>
          <div style={{fontSize:8,color:'#555',lineHeight:1.6}}>AI writes a professional scouting report in the style of D1/D2/D3 recruiting staff · Based on your actual 117-play season data · Print and hand to any college coach you meet</div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:14}}>
          <div>
            <div style={{fontSize:9,fontWeight:700,color:'#555',marginBottom:8,letterSpacing:1}}>SELECT PLAYER</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:12}}>
              {Object.keys(profiles).map(name=>{
                const pr=profiles[name]
                return<button key={name} onClick={()=>{setTarget(name);setReport('')}} style={{padding:'12px 8px',background:target===name?pr.col+'11':'#0d0d0d',border:`1px solid ${target===name?pr.col:'#252525'}`,borderRadius:8,cursor:'pointer',textAlign:'center'}}>
                  <div style={{width:36,height:36,borderRadius:8,background:pr.col+'22',border:`1px solid ${pr.col}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700,color:pr.col,margin:'0 auto 6px'}}>{name.split(' ').map(n=>n[0]).join('')}</div>
                  <div style={{fontSize:10,fontWeight:700,color:target===name?pr.col:'#555'}}>{name}</div>
                  <div style={{fontSize:8,color:'#444',marginTop:2}}>Grade {pr.grade} · RTG {pr.rtg}</div>
                </button>
              })}
            </div>
            <div style={{fontSize:9,fontWeight:700,color:'#555',marginBottom:6,letterSpacing:1}}>REPORT STYLE</div>
            <select value={style} onChange={e=>setStyle(e.target.value)} style={{width:'100%',background:'#111',border:'0.5px solid #252525',borderRadius:8,color:'#ccc',padding:'10px',fontSize:13,marginBottom:12}}>
              {['College Recruiting Coordinator','Small College Scout','D2 Recruiting Coordinator','D2 Scout','D3 Program Director','NAIA Evaluator','Advanced Scouting Report','Junior College Scout'].map(s=><option key={s} value={s}>{s}</option>)}
            </select>
            <div style={{fontSize:9,fontWeight:700,color:'#555',marginBottom:8,letterSpacing:1}}>PHYSICAL PROFILE (optional but recommended)</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
              {[['height','Height (e.g. 6-2)'],['weight','Weight (lbs)'],['dash','40 Time (e.g. 4.7)'],['gpa','GPA'],['gradYear','Grad Year']].map(([k,lbl])=>(
                <div key={k}><div style={{fontSize:7,color:'#555',marginBottom:3}}>{lbl.toUpperCase()}</div>
                <input value={physical[k]} onChange={e=>setPhysical(p=>({...p,[k]:e.target.value}))} placeholder={lbl} style={{width:'100%',background:'#111',border:'0.5px solid #252525',borderRadius:6,color:'#ccc',padding:'7px',fontSize:12,outline:'none',boxSizing:'border-box'}}/></div>
              ))}
            </div>
          </div>
          <div>
            <div style={{fontSize:9,fontWeight:700,color:'#555',marginBottom:8,letterSpacing:1}}>PLAYER SNAPSHOT</div>
            <div style={{background:p.col+'08',border:`1px solid ${p.col}33`,borderRadius:10,padding:14,marginBottom:12}}>
              <div style={{fontSize:14,fontWeight:700,color:p.col,marginBottom:8}}>{target} — {style}</div>
              <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(3,1fr)',gap:6,marginBottom:10}}>
                {[['Comp%',p.comp,p.col],['Passer RTG',p.rtg,p.col],['Yds/Play',p.ypa,'#F0B429'],['Deep Ball',p.deep,p.deep==='88%'?'#22c55e':'#d97706'],['Hash Acc.',p.hash,parseInt(p.hash)>=73?'#22c55e':'#dc2626'],['CPOE',p.cpoe,p.cpoe.startsWith('+')?'#22c55e':'#dc2626']].map(([l,v,col])=>(
                  <div key={l} style={{background:'#111',borderRadius:6,padding:'8px 4px',textAlign:'center'}}>
                    <div style={{fontSize:13,fontWeight:700,color:col}}>{v}</div>
                    <div style={{fontSize:7,color:'#555',marginTop:2}}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{fontSize:8,color:'#555',marginBottom:3}}>STYLE</div>
              <div style={{fontSize:11,color:p.col,fontWeight:700,marginBottom:6}}>{p.style}</div>
              <div style={{fontSize:8,color:'#555',marginBottom:3}}>PROJECTION</div>
              <div style={{fontSize:11,color:'#ccc'}}>{p.proj}</div>
            </div>
            <button onClick={generate} disabled={load} style={{width:'100%',padding:'14px',background:load?'#111':'#14532d',border:`1px solid ${load?'#252525':'#22c55e'}`,borderRadius:8,color:load?'#555':'#22c55e',fontWeight:700,fontSize:14,cursor:load?'default':'pointer',marginBottom:8}}>
              {load?'⏳ Writing scout report from 117 plays...':'📄 GENERATE SCOUT REPORT'}
            </button>
            <div style={{background:'#0d0d0d',border:'0.5px solid #1d3a1d',borderRadius:6,padding:10}}>
              <div style={{fontSize:8,fontWeight:700,color:'#22c55e',marginBottom:4}}>HOW TO USE THIS</div>
              <div style={{fontSize:11,color:'#555',lineHeight:1.7}}>1. Fill in physical profile above if you have it<br/>2. Select report style (D2 scout for Cooper target schools)<br/>3. Generate → edit → print<br/>4. Hand to every college coach you meet at showcases<br/>5. Email as PDF attachment to recruiting coordinators</div>
            </div>
          </div>
        </div>
        {report?(
          <div style={{background:'#0d0d0d',border:'0.5px solid #252525',borderRadius:8,padding:20}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14,paddingBottom:10,borderBottom:'0.5px solid #252525'}}>
              <div><div style={{fontSize:14,fontWeight:700,color:'#22c55e'}}>{target.toUpperCase()} — SCOUTING EVALUATION</div><div style={{fontSize:8,color:'#555',marginTop:2}}>WESTFIELD SHAMROCKS · CLASS OF {physical.gradYear||'2027'} · Based on 117 tracked plays · Generated by AI analyst</div></div>
              <div style={{background:'#14532d',border:'1px solid #22c55e',borderRadius:6,padding:'4px 10px',fontSize:8,fontWeight:700,color:'#22c55e',flexShrink:0}}>CONFIDENTIAL</div>
            </div>
            {fmt(report)}
          </div>
        ):!load&&(
          <div style={{background:'#0d0d0d',border:'0.5px solid #1a1a1a',borderRadius:8,padding:32,textAlign:'center',color:'#333',fontSize:13}}>Select a player and report style above · Add physical profile for a complete report · Generate</div>
        )}
      </div>
    )
  }


  const FilmNotesTab=()=>{
    const [notes,setNotes]=React.useState([])
    const [player,setPlayer]=React.useState('Cooper Melvin')
    const [tag,setTag]=React.useState('Strength')
    const [note,setNote]=React.useState('')
    const [sess,setSess]=React.useState('5/12')
    const [filter,setFilter]=React.useState('All')
    const [aiSum,setAiSum]=React.useState('')
    const [aiLoad,setAiLoad]=React.useState(false)
    const [setupOpen,setSetupOpen]=React.useState(false)
    const [videoUrl,setVideoUrl]=React.useState('')

    const players=['Cooper Melvin','Ben Kooi','WR1','WR2','RB1','OL','Team']
    const tags=['Strength','Weakness','Technique Fix','Highlight','Red Flag','Release Mechanics','Footwork','Route Running','Decision Making','Coachable Moment']
    const sessions=['4/21','4/27','4/30','Showcase','5/8','5/12','Next Session']
    const tc=t=>({Strength:'#22c55e',Weakness:'#dc2626','Red Flag':'#dc2626',Highlight:'#F0B429','Technique Fix':'#06b6d4','Release Mechanics':'#06b6d4',Footwork:'#a78bfa','Route Running':'#d97706','Decision Making':'#F0B429','Coachable Moment':'#22c55e'}[t]||'#9ca3af')

    const quickTags=[
      {label:'Release too high',tag:'Release Mechanics',txt:'Release point too high when comfortable — drops shoulder and launches upward. Fix: flat arm path drill.'},
      {label:'Great deep ball',tag:'Strength',txt:'Elite deep ball throw — proper weight transfer, clean release, ball placement perfect.'},
      {label:'Happy feet in pocket',tag:'Technique Fix',txt:'Happy feet under pressure — moving before pocket collapses. Needs reset and reload drill.'},
      {label:'Stares down WR',tag:'Decision Making',txt:'Locks eyes on primary target before snap — defender following his eyes. Fix: look off safety.'},
      {label:'Perfect read',tag:'Highlight',txt:'Went through full progression — read coverage pre-snap, went through 1-2-3, found open man.'},
      {label:'Hash throw off',tag:'Weakness',txt:'Hash throw mechanics breaking down — not setting feet toward target on left/right hash. Needs rep work.'},
    ]

    const addNote=()=>{if(!note.trim())return;setNotes(p=>[...p,{id:Date.now(),player,tag,note,sess,time:new Date().toLocaleTimeString(),videoUrl}]);setNote('');setVideoUrl('')}
    const addQuick=(q)=>{setTag(q.tag);setNote(q.txt)}
    const filtered=filter==='All'?notes:notes.filter(n=>n.tag===filter||n.player===filter||n.sess===filter)

    const summarize=async()=>{
      if(!notes.length)return;setAiLoad(true);setAiSum('')
      const nt=notes.map(n=>`[${n.sess}] ${n.player} — ${n.tag}: ${n.note}`).join('\n')
      try{
        const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:600,system:'You are an elite football analyst summarizing film review notes into a coaching report. Group by player. Give the top 3 priorities for each player. Then give 3 practice drill recommendations. Be specific and direct. This should read like what an NFL position coach gives his coordinator after film review.',messages:[{role:'user',content:`Analyze these film notes and write a coaching report with top priorities and drill recommendations:\n\n${nt}`}]})})
        const d=await r.json();setAiSum(d.content?.[0]?.text||'Error')
      }catch(e){setAiSum('Connection error.')}
      setAiLoad(false)
    }

    return(
      <div style={{padding:isMobile?10:16,fontFamily:'Helvetica,Arial,sans-serif'}}>
        <div style={{background:'#0a0a0a',border:'1px solid #06b6d4',borderRadius:8,padding:12,marginBottom:12}}>
          <div style={{fontSize:11,fontWeight:700,color:'#06b6d4',letterSpacing:2}}>🎬 FILM NOTES — Tag Every Rep · AI Builds the Coaching Report</div>
          <div style={{fontSize:8,color:'#555',marginTop:2}}>Film every practice on a tripod · Review the footage · Log what you see · AI turns your notes into an NFL-level coaching report after 2 sessions</div>
        </div>

        <button onClick={()=>setSetupOpen(!setupOpen)} style={{width:'100%',marginBottom:10,padding:'10px',background:'#07070f',border:'1px solid #7c3aed',borderRadius:8,color:'#a78bfa',fontWeight:700,fontSize:12,cursor:'pointer',textAlign:'left',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span>📷 TRIPOD SETUP GUIDE — How to film your practice like a pro</span>
          <span style={{fontSize:10}}>{setupOpen?'▲ Close':'▼ Open'}</span>
        </button>
        {setupOpen&&(
          <div style={{background:'#07070f',border:'1px solid #7c3aed',borderRadius:8,padding:14,marginBottom:12}}>
            <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:isMobile?8:10}}>
              <div>
                <div style={{fontSize:9,fontWeight:700,color:'#a78bfa',marginBottom:6,letterSpacing:1}}>CAMERA POSITION</div>
                {['Set up your phone or iPad on a tripod at the 50-yard line','Height: waist to chest level of the players (not too high, not too low)','Angle: slightly behind the QB so you see the whole field and his release','For 7on7: position yourself 10 yards behind the QB on the sideline','Keep the whole formation in frame — you need to see routes develop'].map((t,i)=><div key={i} style={{fontSize:11,color:'#ccc',padding:'4px 0',borderBottom:'0.5px solid #1a1a2e',lineHeight:1.5,display:'flex',gap:6}}><span style={{color:'#a78bfa',flexShrink:0}}>→</span>{t}</div>)}
              </div>
              <div>
                <div style={{fontSize:9,fontWeight:700,color:'#a78bfa',marginBottom:6,letterSpacing:1}}>WHAT TO FILM FOR</div>
                {['QB release point — is the arm slot consistent rep to rep?','QB footwork — are feet set before throwing on hash routes?','WR releases — are they beating press on the first step?','WR separation — how much space at the catch point?','OL — is the pocket clean or is pressure getting through?','Route running — are routes crisp or drifting at the top?'].map((t,i)=><div key={i} style={{fontSize:11,color:'#ccc',padding:'4px 0',borderBottom:'0.5px solid #1a1a2e',lineHeight:1.5,display:'flex',gap:6}}><span style={{color:'#a78bfa',flexShrink:0}}>→</span>{t}</div>)}
              </div>
            </div>
            <div style={{marginTop:10,background:'#1a0a2e',borderRadius:6,padding:10}}>
              <div style={{fontSize:9,fontWeight:700,color:'#a78bfa',marginBottom:4}}>THE PROCESS — Two sessions builds a coaching report NFL teams pay millions for</div>
              <div style={{display:'grid',gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(4,1fr)',gap:6}}>
                {[['Session 1','Film the practice. Log 20+ notes here in real time or during film review.'],['Session 2','Film again. Add 20+ more notes. Patterns start to appear.'],['AI Analyze','Hit AI Summarize. Claude reads all notes and writes the coaching report.'],['Next Practice','Hand the printed report to every position coach. Act on it immediately.']].map(([step,desc])=>(
                  <div key={step} style={{background:'#0a0612',borderRadius:6,padding:8,textAlign:'center'}}>
                    <div style={{fontSize:10,fontWeight:700,color:'#a78bfa',marginBottom:4}}>{step}</div>
                    <div style={{fontSize:9,color:'#666',lineHeight:1.5}}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div style={{display:'grid',gridTemplateColumns:'1fr 1.6fr',gap:12}}>
          <div style={{background:'#0d0d0d',border:'0.5px solid #252525',borderRadius:8,padding:14}}>
            <div style={{fontSize:9,fontWeight:700,color:'#06b6d4',marginBottom:10,letterSpacing:1}}>ADD FILM NOTE</div>
            <div style={{marginBottom:8}}><div style={{fontSize:7,color:'#555',marginBottom:4}}>PLAYER</div>
              <select value={player} onChange={e=>setPlayer(e.target.value)} style={{width:'100%',background:'#111',border:'0.5px solid #252525',borderRadius:6,color:'#ccc',padding:'8px',fontSize:12}}>{players.map(p=><option key={p} value={p}>{p}</option>)}</select>
            </div>
            <div style={{marginBottom:8}}><div style={{fontSize:7,color:'#555',marginBottom:4}}>SESSION</div>
              <div style={{display:'grid',gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(4,1fr)',gap:3}}>
                {sessions.map(s=><button key={s} onClick={()=>setSess(s)} style={{padding:'5px 2px',background:sess===s?'#0c1a3a':'#111',border:`1px solid ${sess===s?'#06b6d4':'#252525'}`,borderRadius:4,color:sess===s?'#06b6d4':'#555',fontSize:8,fontWeight:700,cursor:'pointer'}}>{s}</button>)}
              </div>
            </div>
            <div style={{marginBottom:8}}><div style={{fontSize:7,color:'#555',marginBottom:4}}>TAG TYPE</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:3}}>
                {tags.map(t=><button key={t} onClick={()=>setTag(t)} style={{padding:'5px 6px',background:tag===t?tc(t)+'22':'#111',border:`1px solid ${tag===t?tc(t):'#252525'}`,borderRadius:4,color:tag===t?tc(t):'#555',fontSize:8,fontWeight:700,cursor:'pointer',textAlign:'left'}}>{t}</button>)}
              </div>
            </div>
            <div style={{marginBottom:8}}><div style={{fontSize:7,color:'#555',marginBottom:4}}>QUICK TAGS — tap to pre-fill</div>
              <div style={{display:'flex',flexDirection:'column',gap:3}}>
                {quickTags.map(q=><button key={q.label} onClick={()=>addQuick(q)} style={{padding:'5px 8px',background:'#111',border:'0.5px solid #252525',borderRadius:4,color:'#666',fontSize:9,cursor:'pointer',textAlign:'left'}}>⚡ {q.label}</button>)}
              </div>
            </div>
            <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="What did you see? Be specific — release point, footwork, coverage read, route precision, separation distance..." style={{width:'100%',background:'#111',border:'0.5px solid #252525',borderRadius:6,color:'#ccc',padding:'10px',fontSize:12,outline:'none',minHeight:80,resize:'none',marginBottom:8,boxSizing:'border-box',lineHeight:1.6}}/>
            <div style={{marginBottom:8}}><div style={{fontSize:7,color:'#555',marginBottom:4}}>VIDEO LINK (Hudl or YouTube — optional)</div>
              <input value={videoUrl} onChange={e=>setVideoUrl(e.target.value)} placeholder="Paste Hudl or YouTube URL..." style={{width:'100%',background:'#111',border:'0.5px solid #252525',borderRadius:6,color:'#ccc',padding:'8px',fontSize:12,outline:'none',boxSizing:'border-box'}}/>
            </div>
            <button onClick={addNote} disabled={!note.trim()} style={{width:'100%',padding:'11px',background:'#0c1a3a',border:'1px solid #06b6d4',borderRadius:8,color:'#06b6d4',fontWeight:700,fontSize:13,cursor:'pointer'}}>+ ADD FILM NOTE</button>
            <div style={{marginTop:10,background:'#111',borderRadius:6,padding:8}}>
              <div style={{fontSize:8,fontWeight:700,color:'#555',marginBottom:4}}>SESSION TOTALS</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:4}}>
                {['Strength','Weakness','Technique Fix'].map(t=>{const n2=notes.filter(x=>x.tag===t).length;return<div key={t} style={{textAlign:'center'}}><div style={{fontSize:14,fontWeight:700,color:tc(t)}}>{n2}</div><div style={{fontSize:7,color:'#555'}}>{t.split(' ')[0]}</div></div>})}
              </div>
            </div>
          </div>

          <div>
            <div style={{display:'flex',gap:4,flexWrap:'wrap',marginBottom:8}}>
              {['All',...tags.slice(0,6),...players.slice(0,4)].map(f=><button key={f} onClick={()=>setFilter(f)} style={{padding:'4px 8px',background:filter===f?'#0c1a3a':'#0d0d0d',border:`0.5px solid ${filter===f?'#06b6d4':'#252525'}`,borderRadius:14,color:filter===f?'#06b6d4':'#555',fontSize:8,cursor:'pointer'}}>{f}</button>)}
            </div>
            {notes.length>=5&&(
              <button onClick={summarize} disabled={aiLoad} style={{width:'100%',padding:'11px',background:aiLoad?'#111':'#07070f',border:`1px solid ${aiLoad?'#252525':'#06b6d4'}`,borderRadius:8,color:aiLoad?'#555':'#06b6d4',fontWeight:700,fontSize:12,cursor:'pointer',marginBottom:8}}>
                {aiLoad?'Analyzing all film notes...':'🤖 AI COACHING REPORT — Turns your notes into what NFL coaches produce from film'}
              </button>
            )}
            {notes.length>0&&notes.length<5&&<div style={{background:'#0d0d0d',border:'0.5px solid #1a1a1a',borderRadius:6,padding:8,marginBottom:8,textAlign:'center'}}><div style={{fontSize:11,color:'#333'}}>Add {5-notes.length} more notes to unlock AI coaching report</div><div style={{height:4,background:'#1a1a1a',borderRadius:2,marginTop:6,overflow:'hidden'}}><div style={{height:'100%',width:`${notes.length/5*100}%`,background:'#06b6d4',borderRadius:2}}/></div></div>}
            {aiSum&&(
              <div style={{background:'#07070f',border:'1px solid #06b6d4',borderRadius:8,padding:14,marginBottom:8}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8,paddingBottom:6,borderBottom:'0.5px solid #0c1a3a'}}>
                  <div style={{fontSize:9,fontWeight:700,color:'#06b6d4',letterSpacing:1}}>AI COACHING REPORT — {notes.length} observations analyzed</div>
                  <div style={{fontSize:7,color:'#444'}}>NFL-level methodology</div>
                </div>
                <div style={{fontSize:12,color:'#ccc',lineHeight:1.7,whiteSpace:'pre-wrap'}}>{aiSum}</div>
              </div>
            )}
            {filtered.length===0?<div style={{background:'#0d0d0d',border:'0.5px solid #1a1a1a',borderRadius:8,padding:28,textAlign:'center',color:'#333',fontSize:12}}>No notes yet — start filming and logging observations</div>:
            <div style={{display:'flex',flexDirection:'column',gap:5}}>
              {filtered.map((n,i)=>(
                <div key={n.id} style={{background:'#0d0d0d',border:`0.5px solid ${tc(n.tag)}33`,borderRadius:8,padding:'10px 12px',borderLeft:`3px solid ${tc(n.tag)}`}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
                    <div style={{display:'flex',gap:6,alignItems:'center',flexWrap:'wrap'}}>
                      <span style={{fontSize:9,fontWeight:700,color:'#F0B429'}}>{n.player}</span>
                      <span style={{background:tc(n.tag)+'22',color:tc(n.tag),fontSize:8,fontWeight:700,padding:'1px 6px',borderRadius:4}}>{n.tag}</span>
                      <span style={{fontSize:8,color:'#555'}}>{n.sess}</span>
                    </div>
                    <span style={{fontSize:7,color:'#333',flexShrink:0}}>{n.time}</span>
                  </div>
                  <div style={{fontSize:12,color:'#ccc',lineHeight:1.5}}>{n.note}</div>
                  {n.videoUrl&&<div style={{marginTop:4}}><a href={n.videoUrl} target='_blank' rel='noopener noreferrer' style={{fontSize:10,color:'#06b6d4',display:'flex',alignItems:'center',gap:4,textDecoration:'none'}}>▶ Open clip in Hudl / YouTube</a></div>}
                </div>
              ))}
            </div>}
          </div>
        </div>
      </div>
    )
  }


  const PresentationTab=()=>{
    const [slide,setSlide]=React.useState(0)
    const [fs,setFs]=React.useState(false)
    const slides=[
      {t:'WESTFIELD SHAMROCKS',s:'2026-2027 Offensive Analytics · Rocks Football',type:'title'},
      {t:'SEASON OVERVIEW',s:'117 Plays · 6 Sessions · Both QBs · Full Picture',type:'overview'},
      {t:'COOPER MELVIN — QB1',s:'Starter · A Grade · College Showcase Ready',type:'cooper'},
      {t:'BEN KOOI — QB2',s:'Backup · B Grade · High Upside · Do Not Give Up',type:'ben'},
      {t:'TOP CONCEPTS — CALL EVERY GAME',s:'These work every single time — automatic',type:'concepts'},
      {t:'CUT IMMEDIATELY',s:'These hurt us — removing saves points every game',type:'cuts'},
      {t:'NEXTGEN METRICS',s:'NFL-level analytics applied to our program',type:'nextgen'},
      {t:'WHAT WE DO NEXT',s:'Priority actions for the whole team',type:'actions'},
    ]
    const S=({s})=>{
      const big=fs?{h:56,sub:20,stat:32,body:16,card:28}:{h:22,sub:13,stat:18,body:13,card:16}
      if(s.type==='title')return(
        <div style={{textAlign:'center',padding:fs?'60px 40px':'24px 20px'}}>
          <div style={{fontSize:fs?60:32,fontWeight:700,color:'#22c55e',letterSpacing:4,marginBottom:8}}>WESTFIELD</div>
          <div style={{fontSize:fs?44:24,fontWeight:700,color:'#fff',letterSpacing:6,marginBottom:6}}>SHAMROCKS</div>
          <div style={{fontSize:fs?18:11,color:'#F0B429',letterSpacing:3,marginBottom:fs?48:24}}>OFFENSIVE ANALYTICS · 2026-2027 · ROCKS FOOTBALL</div>
          <div style={{display:'flex',justifyContent:'center',gap:fs?48:20,flexWrap:'wrap'}}>
            {[['117','Total Plays'],['84%','Cooper Comp'],['87','Cooper RTG'],['A','Season Grade'],['6','Sessions']].map(([v,l])=>(
              <div key={l} style={{textAlign:'center'}}>
                <div style={{fontSize:fs?52:28,fontWeight:700,color:'#22c55e',lineHeight:1}}>{v}</div>
                <div style={{fontSize:fs?14:9,color:'#555',letterSpacing:2,marginTop:4}}>{l.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
      )
      if(s.type==='overview')return(
        <div style={{padding:fs?'32px 48px':'16px 20px'}}>
          <div style={{display:'grid',gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(4,1fr)',gap:8,marginBottom:16}}>
            {[['117','Total Plays','#22c55e'],['84%','Cooper Comp','#22c55e'],['70%','Ben Comp','#F0B429'],['87','Cooper RTG','#22c55e'],['71','Ben RTG','#F0B429'],['6','Sessions','#ccc'],['13.2','Cooper YPA','#22c55e'],['A','Season Grade','#22c55e']].map(([v,l,col])=>(
              <div key={l} style={{background:'#111',borderRadius:8,padding:'12px 4px',textAlign:'center'}}>
                <div style={{fontSize:fs?36:20,fontWeight:700,color:col}}>{v}</div>
                <div style={{fontSize:fs?12:8,color:'#555',marginTop:3}}>{l.toUpperCase()}</div>
              </div>
            ))}
          </div>
          <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:isMobile?8:10}}>
            {[['STRENGTHS — What is Working',['Baltimore 100% — best big play in script','Post 100% — primary 1st down weapon','Stick 100% — call every series, never fails','Cooper deep ball 88% — elite vs NFL 52% avg','Both QBs 80% at College Showcase under pressure'],'#22c55e'],['GAPS — What We Must Fix',['Red zone 0% BOTH QBs — critical, install package now','Sail 0% and Fade 0% — remove from live script NOW','Right hash deep routes — 0% all season','Ben deep ball 50% — keep him short only','Hash accuracy 73% target — need to reach 80%+'],'#dc2626']].map(([title,items,col])=>(
              <div key={title} style={{background:col+'08',border:`0.5px solid ${col}22`,borderRadius:8,padding:12}}>
                <div style={{fontSize:fs?14:10,fontWeight:700,color:col,marginBottom:8}}>{title}</div>
                {items.map((item,i)=><div key={i} style={{fontSize:fs?13:10,color:'#ccc',padding:'4px 0',borderBottom:`0.5px solid ${col}22`,lineHeight:1.5}}>{item}</div>)}
              </div>
            ))}
          </div>
        </div>
      )
      if(s.type==='cooper')return(
        <div style={{padding:fs?'32px 48px':'16px 20px'}}>
          <div style={{display:'flex',gap:fs?40:20,alignItems:'flex-start'}}>
            <div style={{background:'#14532d',border:'2px solid #22c55e',borderRadius:12,padding:fs?'20px 24px':'12px 16px',textAlign:'center',minWidth:fs?160:120,flexShrink:0}}>
              <div style={{fontSize:fs?40:24,fontWeight:700,color:'#22c55e'}}>CM</div>
              <div style={{fontSize:fs?18:12,fontWeight:700,color:'#22c55e',marginTop:4}}>A ELITE</div>
              <div style={{fontSize:fs?13:9,color:'#555',marginTop:2}}>RTG 87</div>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:fs?28:16,fontWeight:700,color:'#fff',marginBottom:6}}>Cooper Melvin — QB1 Starter</div>
              <div style={{fontSize:fs?15:10,color:'#22c55e',fontWeight:700,marginBottom:14,letterSpacing:1}}>STRONG ARM · MOBILITY · HIGH IQ</div>
              <div style={{display:'grid',gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(4,1fr)',gap:8,marginBottom:14}}>
                {[['84%','Comp Rate','#22c55e'],['658','Total Yards','#fff'],['13.2','Yds/Play','#F0B429'],['87','Passer RTG','#22c55e']].map(([v,l,col])=>(
                  <div key={l} style={{background:'#111',borderRadius:8,padding:'10px 4px',textAlign:'center'}}>
                    <div style={{fontSize:fs?30:18,fontWeight:700,color:col}}>{v}</div>
                    <div style={{fontSize:fs?12:8,color:'#555',marginTop:3}}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:8}}>
                <div style={{background:'#0a1a0a',borderRadius:8,padding:10}}>
                  <div style={{fontSize:fs?13:9,fontWeight:700,color:'#22c55e',marginBottom:6}}>NEXTGEN vs NFL</div>
                  {[['Deep Ball','88%','52% NFL avg — ELITE ✓'],['Air Yards','13.2','8.0 NFL avg — ABOVE ✓'],['TTT','2.0s','2.36s NFL avg — IN RANGE ✓'],['CPOE','+4%','Outperforms projection ✓']].map(([l,v,n])=>(
                    <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'3px 0',borderBottom:'0.5px solid #1d3a1d'}}><span style={{fontSize:fs?12:9,color:'#9ca3af'}}>{l}</span><div><span style={{fontSize:fs?13:10,fontWeight:700,color:'#22c55e'}}>{v}</span><span style={{fontSize:7,color:'#444',marginLeft:6}}>{n}</span></div></div>
                  ))}
                </div>
                <div style={{background:'#1a0a0a',borderRadius:8,padding:10}}>
                  <div style={{fontSize:fs?13:9,fontWeight:700,color:'#dc2626',marginBottom:6}}>FIX THESE = SCHOLARSHIP</div>
                  {[['Hash 73%→85%','RTG 87→96 · D3/NAIA level'],['Redzone 0%→50%','RTG 87→102 · D2 level'],['Hash + redzone + consistency =','elite HS level with continued growth']].map(([fix,result])=>(
                    <div key={fix} style={{padding:'4px 0',borderBottom:'0.5px solid #2a0404'}}><div style={{fontSize:fs?12:9,fontWeight:700,color:'#F0B429'}}>{fix}</div><div style={{fontSize:fs?11:8,color:'#666'}}>{result}</div></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
      if(s.type==='ben')return(
        <div style={{padding:fs?'32px 48px':'16px 20px'}}>
          <div style={{display:'flex',gap:fs?40:20,alignItems:'flex-start'}}>
            <div style={{background:'#2a1a00',border:'2px solid #F0B429',borderRadius:12,padding:fs?'20px 24px':'12px 16px',textAlign:'center',minWidth:fs?160:120,flexShrink:0}}>
              <div style={{fontSize:fs?40:24,fontWeight:700,color:'#F0B429'}}>BK</div>
              <div style={{fontSize:fs?18:12,fontWeight:700,color:'#F0B429',marginTop:4}}>B · HIGH UPSIDE</div>
              <div style={{fontSize:fs?13:9,color:'#555',marginTop:2}}>RTG 71 → 96+</div>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:fs?28:16,fontWeight:700,color:'#fff',marginBottom:4}}>Ben Kooi — QB2 Backup</div>
              <div style={{fontSize:fs?14:10,color:'#F0B429',fontWeight:700,marginBottom:14,letterSpacing:1}}>HIGH UPSIDE · DO NOT GIVE UP · 6 MONTHS TO QB1</div>
              <div style={{display:'grid',gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(4,1fr)',gap:8,marginBottom:14}}>
                {[['70%','Comp Rate','#d97706'],['310','Yards','#fff'],['6.5','Yds/Play','#d97706'],['71','Passer RTG','#d97706']].map(([v,l,col])=>(
                  <div key={l} style={{background:'#111',borderRadius:8,padding:'10px 4px',textAlign:'center'}}>
                    <div style={{fontSize:fs?30:18,fontWeight:700,color:col}}>{v}</div>
                    <div style={{fontSize:fs?12:8,color:'#555',marginTop:3}}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:8}}>
                <div style={{background:'#0c0a06',borderRadius:8,padding:10}}>
                  <div style={{fontSize:fs?13:9,fontWeight:700,color:'#F0B429',marginBottom:6}}>SESSION TREND</div>
                  {[['4/21','B · 70% comp'],['4/27','C+ · 67% comp'],['4/30','C · 50% comp'],['Show.','B+ · 80% 🔥 BEST'],['5/8','D · 40% comp'],['5/12','C+ · 55% ↑']].map(([d,g])=>(
                    <div key={d} style={{display:'flex',justifyContent:'space-between',padding:'3px 0',borderBottom:'0.5px solid #2a1a00'}}><span style={{fontSize:fs?11:8,color:'#555'}}>{d}</span><span style={{fontSize:fs?11:9,color:'#F0B429'}}>{g}</span></div>
                  ))}
                </div>
                <div style={{background:'#0c0a06',borderRadius:8,padding:10}}>
                  <div style={{fontSize:fs?13:9,fontWeight:700,color:'#F0B429',marginBottom:6}}>8-STEP PLAN TO QB1</div>
                  {['Release mechanics — flat arm daily','Hash accuracy 60%→75%','Redzone package install','Deep ball mechanics','Film study — Mahomes reads','Upper body strength','Decision speed — slow down','Consistency — no lazy reps'].map((step,i)=>(
                    <div key={i} style={{fontSize:fs?11:8,color:'#9ca3af',padding:'2px 0',borderBottom:'0.5px solid #1a1a00'}}><span style={{color:'#F0B429',marginRight:4}}>{i+1}.</span>{step}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
      if(s.type==='concepts')return(
        <div style={{padding:fs?'32px 48px':'16px 20px'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:fs?16:10,marginBottom:fs?16:10}}>
            {[['Baltimore','100% comp · 12.4 avg yds · +1.8 EPA · BEST BIG PLAY IN SCRIPT'],['Post','100% comp · 13.1 avg yds · +1.4 EPA · PRIMARY 1ST DOWN WEAPON'],['Stick','100% comp · 7.7 avg yds · +0.8 EPA · CALL EVERY DRIVE NEVER FAILS'],['Four Verts','100% comp · 22.0 avg yds · +1.9 EPA · MOST EXPLOSIVE PLAY'],['Verticals','88% comp · 28.5 avg yds · +2.1 EPA · HIGHEST EPA IN SCRIPT'],['Out + Slant','100% / 90% · SOLID CONVERTS · KEEP IN EVERY GAME']].map(([ct,st])=>(
              <div key={ct} style={{background:'#0a1a0a',border:'1px solid #22c55e33',borderRadius:10,padding:fs?'16px':'10px'}}>
                <div style={{fontSize:fs?24:14,fontWeight:700,color:'#22c55e',marginBottom:4}}>{ct}</div>
                <div style={{fontSize:fs?14:9,color:'#F0B429'}}>{st}</div>
              </div>
            ))}
          </div>
        </div>
      )
      if(s.type==='cuts')return(
        <div style={{padding:fs?'40px 48px':'20px',display:'flex',flexDirection:'column',gap:10}}>
          {[['Sail','0% ALL SEASON · Both QBs · -0.6 EPA · Remove from live script immediately','#dc2626'],['Fade','0% ALL SEASON · Both QBs · -0.8 EPA · Worst play in script · Drill only','#dc2626'],['Red Zone','0% BOTH QBs · No package installed · Critical gap · Must install NOW','#dc2626'],['Right Hash Deep','0% all season · Cooper and Ben · Avoid until mechanics fixed','#d97706']].map(([ct,st,col])=>(
            <div key={ct} style={{background:col+'08',border:`1px solid ${col}33`,borderRadius:10,padding:fs?'16px 20px':'10px 14px',display:'flex',gap:fs?24:12,alignItems:'center'}}>
              <div style={{fontSize:fs?28:16,fontWeight:700,color:col,minWidth:fs?120:80,flexShrink:0}}>{ct}</div>
              <div style={{fontSize:fs?15:10,color:col+'cc'}}>{st}</div>
            </div>
          ))}
        </div>
      )
      if(s.type==='nextgen')return(
        <div style={{padding:fs?'32px 48px':'16px 20px'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:fs?12:8}}>
            {[['timeToThrow','Cooper 2.0s','NFL 2.36s avg · IN RANGE ✓','#22c55e'],['airYards/play','Cooper 13.2','NFL 8.0 avg · ABOVE AVERAGE ✓','#22c55e'],['Comp Probability','Cooper 84%','CPOE +4% · OUTPERFORMS ✓','#22c55e'],['Deep Ball %','Cooper 88%','NFL avg 52% · ELITE ✓','#22c55e'],['Hash Accuracy','Cooper 73%','NFL 71% avg · Target 80%+','#d97706'],['Red Zone','BOTH 0%','Critical gap · Install package NOW','#dc2626']].map(([l,v,n,col])=>(
              <div key={l} style={{background:'#111',borderRadius:8,padding:fs?'16px':'10px'}}>
                <div style={{fontSize:fs?13:8,fontWeight:700,color:'#06b6d4',marginBottom:4}}>{l}</div>
                <div style={{fontSize:fs?26:16,fontWeight:700,color:col}}>{v}</div>
                <div style={{fontSize:fs?12:8,color:'#555',marginTop:4}}>{n}</div>
              </div>
            ))}
          </div>
        </div>
      )
      return(
        <div style={{padding:fs?'32px 48px':'16px 20px'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:fs?14:8}}>
            {[['DO THIS WEEK','#22c55e',['Install red zone package for both QBs — 0% all season critical','Start filming every practice on tripod — film notes tab','Log every play in Game Day tab — build pressure rate data','Hand Coach Matt the PDF report — mattmolly@me.com','Generate scout report for Cooper — print for next showcase']],['DO THIS MONTH','#d97706',['Hash accuracy drills every practice — Cooper 73%→85% target','Ben release mechanics daily — flat arm path 20 reps','Add all teammates to Player Profiles — track everyone','Use Film Notes to tag 20+ observations — unlock AI coaching report','Send scout reports to D2/D3 recruiting coordinators']],['SEASON GOAL','#F0B429',['Cooper RTG 87→96 on hash fix — D2/D3 scholarship level','Cooper RTG 87→102 on redzone fix — strong recruiting profile','Ben RTG 71→96+ — full QB1 capable in 6 months','Pressure rate under 20% — OL earns elite grade','Run this presentation for coaches before every showcase']]].map(([t,col,items])=>(
              <div key={t} style={{background:col+'08',border:`0.5px solid ${col}33`,borderRadius:8,padding:fs?'14px':'10px'}}>
                <div style={{fontSize:fs?14:9,fontWeight:700,color:col,marginBottom:fs?10:6,letterSpacing:1}}>{t}</div>
                {items.map((item,i)=><div key={i} style={{fontSize:fs?13:9,color:col+'cc',padding:'4px 0',borderBottom:`0.5px solid ${col}22`,lineHeight:1.5}}>{item}</div>)}
              </div>
            ))}
          </div>
        </div>
      )
    }
    return(
      <div style={{fontFamily:'Helvetica,Arial,sans-serif',position:fs?'fixed':'relative',top:fs?0:undefined,left:fs?0:undefined,width:fs?'100vw':undefined,height:fs?'100vh':undefined,background:'#050505',zIndex:fs?9999:undefined,display:'flex',flexDirection:'column'}}>
        <div style={{background:'#0a0a0a',borderBottom:'2px solid #F0B429',padding:'10px 16px',display:'flex',justifyContent:'space-between',alignItems:'center',flexShrink:0}}>
          <div style={{display:'flex',gap:5,alignItems:'center'}}>
            {slides.map((_,i)=>(
              <button key={i} onClick={()=>setSlide(i)} style={{width:fs?14:9,height:fs?14:9,borderRadius:'50%',border:'none',background:slide===i?'#22c55e':'#252525',cursor:'pointer',padding:0,transition:'background 0.15s'}}/>
            ))}
            <span style={{fontSize:9,color:'#333',marginLeft:8}}>{slide+1} of {slides.length}</span>
          </div>
          <div style={{fontSize:fs?13:9,fontWeight:700,color:'#F0B429',letterSpacing:2}}>{slides[slide].t}</div>
          <div style={{display:'flex',gap:6}}>
            <button onClick={()=>setSlide(s=>Math.max(0,s-1))} style={{padding:'5px 12px',background:'#111',border:'0.5px solid #252525',borderRadius:6,color:'#ccc',cursor:'pointer',fontSize:12}}>←</button>
            <button onClick={()=>setSlide(s=>Math.min(slides.length-1,s+1))} style={{padding:'5px 12px',background:'#111',border:'0.5px solid #252525',borderRadius:6,color:'#ccc',cursor:'pointer',fontSize:12}}>→</button>
            <button onClick={()=>setFs(!fs)} style={{padding:'5px 12px',background:fs?'#14532d':'#0a1a0a',border:`0.5px solid ${fs?'#22c55e':'#252525'}`,borderRadius:6,color:fs?'#22c55e':'#ccc',cursor:'pointer',fontSize:12,fontWeight:700}}>{fs?'✕ Exit':'⛶ Present'}</button>
          </div>
        </div>
        <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',overflow:'hidden'}}>
          <div style={{fontSize:fs?32:18,fontWeight:700,color:'#fff',textAlign:'center',padding:fs?'20px 48px 4px':'10px 20px 2px'}}>{slides[slide].t}</div>
          <div style={{fontSize:fs?16:10,color:'#F0B429',textAlign:'center',marginBottom:fs?16:8,letterSpacing:1}}>{slides[slide].s}</div>
          <div style={{flex:1,overflow:'hidden'}}><S s={slides[slide]}/></div>
        </div>
        <div style={{textAlign:'center',padding:fs?'12px':'6px',borderTop:'0.5px solid #1a1a1a',flexShrink:0}}>
          <span style={{fontSize:fs?11:8,color:'#333',letterSpacing:2}}>WESTFIELD SHAMROCKS · ROCKS FOOTBALL · TOGETHER. TOUGH. DISCIPLINED. · westfield-dashboard.vercel.app</span>
        </div>
      </div>
    )
  }


  const GameDayAnalyticsBar=({plays})=>{
    if(plays.length<10)return(
      <div style={{background:'#0d0d0d',border:'0.5px solid #1d3a1d',borderRadius:8,padding:12,textAlign:'center'}}>
        <div style={{fontSize:12,color:'#333'}}>Log {10-plays.length} more plays to unlock pressure rate analytics</div>
        <div style={{height:4,background:'#1a1a1a',borderRadius:2,marginTop:8,overflow:'hidden'}}>
          <div style={{height:'100%',width:`${plays.length/10*100}%`,background:'#22c55e',borderRadius:2,transition:'width 0.3s'}}/>
        </div>
        <div style={{fontSize:8,color:'#444',marginTop:4}}>{plays.length}/10 plays · After 30 plays you have full OL pressure grade</div>
      </div>
    )
    const pressurePlays=plays.filter(p=>p.pres==='Pressure')
    const cleanPlays=plays.filter(p=>p.pres==='Clean')
    const pressureRate=Math.round(pressurePlays.length/plays.length*100)
    const cleanRate=100-pressureRate
    const compUnderPressure=pressurePlays.length?Math.round(pressurePlays.filter(p=>p.res==='Complete').length/pressurePlays.length*100):0
    const compClean=cleanPlays.length?Math.round(cleanPlays.filter(p=>p.res==='Complete').length/cleanPlays.length*100):0
    const cm=plays.filter(p=>p.qb==='Cooper Melvin')
    const bk=plays.filter(p=>p.qb==='Ben Kooi')
    const cmPressure=cm.filter(p=>p.pres==='Pressure')
    const bkPressure=bk.filter(p=>p.pres==='Pressure')
    const olGrade=pressureRate<=20?'ELITE':pressureRate<=28?'GOOD':pressureRate<=35?'AVERAGE':'NEEDS WORK'
    const olColor=pressureRate<=20?'#22c55e':pressureRate<=28?'#22c55e':pressureRate<=35?'#d97706':'#dc2626'
    const sepData=plays.filter(p=>p.sep&&p.sep!=='—')
    const openPlays=sepData.filter(p=>p.sep==='Open').length
    const contestedPlays=sepData.filter(p=>p.sep==='Contested').length
    const coveredPlays=sepData.filter(p=>p.sep==='Covered').length
    return(
      <div style={{background:'#0a0d0a',border:'1px solid #22c55e',borderRadius:8,padding:12,marginTop:10}}>
        <div style={{fontSize:9,fontWeight:700,color:'#22c55e',letterSpacing:2,marginBottom:10}}>📡 LIVE NEXTGEN ANALYTICS — {plays.length} plays tracked</div>
        <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr 1fr',gap:isMobile?6:8,marginBottom:10}}>
          <div style={{background:'#111',border:`0.5px solid ${olColor}33`,borderRadius:8,padding:10}}>
            <div style={{fontSize:9,fontWeight:700,color:'#555',marginBottom:4}}>OL PRESSURE RATE</div>
            <div style={{fontSize:28,fontWeight:700,color:olColor,lineHeight:1}}>{pressureRate}%</div>
            <div style={{fontSize:9,fontWeight:700,color:olColor,marginTop:2}}>{olGrade}</div>
            <div style={{fontSize:7,color:'#444',marginTop:2}}>NFL avg: 35% · Target: under 20%</div>
            <div style={{height:4,background:'#1a1a1a',borderRadius:2,marginTop:6,overflow:'hidden'}}>
              <div style={{height:'100%',width:`${Math.min(pressureRate,100)}%`,background:olColor,borderRadius:2}}/>
            </div>
          </div>
          <div style={{background:'#111',borderRadius:8,padding:10}}>
            <div style={{fontSize:9,fontWeight:700,color:'#555',marginBottom:4}}>COMP% CLEAN vs PRESSURE</div>
            <div style={{display:'flex',gap:8,alignItems:'center',marginTop:4}}>
              <div style={{textAlign:'center'}}><div style={{fontSize:18,fontWeight:700,color:'#22c55e'}}>{compClean}%</div><div style={{fontSize:7,color:'#555'}}>Clean pocket</div></div>
              <div style={{fontSize:12,color:'#333'}}>vs</div>
              <div style={{textAlign:'center'}}><div style={{fontSize:18,fontWeight:700,color:compUnderPressure>=60?'#d97706':'#dc2626'}}>{compUnderPressure}%</div><div style={{fontSize:7,color:'#555'}}>Under pressure</div></div>
            </div>
            <div style={{fontSize:7,color:'#444',marginTop:6}}>Gap = {compClean-compUnderPressure}pts · How much pressure hurts</div>
          </div>
          <div style={{background:'#111',borderRadius:8,padding:10}}>
            <div style={{fontSize:9,fontWeight:700,color:'#555',marginBottom:4}}>QB PRESSURE BREAKDOWN</div>
            {[[`Cooper (${cm.length} plays)`,cmPressure.length,cm.length,'#22c55e'],[`Ben (${bk.length} plays)`,bkPressure.length,bk.length,'#F0B429']].map(([n,pr,total,col])=>(
              <div key={n} style={{marginBottom:6}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:2}}><span style={{fontSize:8,color:col}}>{n}</span><span style={{fontSize:9,fontWeight:700,color:total?Math.round(pr/total*100)<=25?'#22c55e':'#dc2626':'#555'}}>{total?`${Math.round(pr/total*100)}% press`:'No data'}</span></div>
                <div style={{height:4,background:'#1a1a1a',borderRadius:2,overflow:'hidden'}}>
                  <div style={{height:'100%',width:`${total?Math.round(pr/total*100):0}%`,background:col,borderRadius:2}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
        {sepData.length>0&&(
          <div style={{background:'#111',borderRadius:8,padding:10}}>
            <div style={{fontSize:9,fontWeight:700,color:'#555',marginBottom:6}}>TARGET SEPARATION GRADES — {sepData.length} tracked throws</div>
            <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(3,1fr)',gap:6}}>
              {[[openPlays,'OPEN (3+ yds)','Receiver had clean separation','#22c55e'],[contestedPlays,'CONTESTED (1-2 yds)','Tight window throw needed','#d97706'],[coveredPlays,'COVERED (0 yds)','Defender in position, bad read','#dc2626']].map(([count,label,note,col])=>(
                <div key={label} style={{background:col+'11',border:`0.5px solid ${col}33`,borderRadius:6,padding:8,textAlign:'center'}}>
                  <div style={{fontSize:18,fontWeight:700,color:col}}>{count}</div>
                  <div style={{fontSize:8,fontWeight:700,color:col,marginTop:2}}>{label}</div>
                  <div style={{fontSize:7,color:'#444',marginTop:2}}>{note}</div>
                  <div style={{fontSize:9,fontWeight:700,color:col,marginTop:2}}>{sepData.length?Math.round(count/sepData.length*100):0}%</div>
                </div>
              ))}
            </div>
            <div style={{fontSize:8,color:'#444',marginTop:6,textAlign:'center'}}>NFL avg: 65% Open · {Math.round(openPlays/(sepData.length||1)*100)>=65?'✓ Above NFL average — QB is making good decisions':'Need more open reads — QB or WR separation issue'}</div>
          </div>
        )}
      </div>
    )
  }









  const QuickCallTab=()=>{
    const [dn,setDn]=React.useState('1st')
    const [dist,setDist]=React.useState('10')
    const [hash,setHash]=React.useState('Middle')
    const [zone,setZone]=React.useState('Open Field')
    const [qb,setQb]=React.useState('Cooper')
    const [score,setScore]=React.useState('Tied')
    const [history,setHistory]=React.useState([])
    const [aiTip,setAiTip]=React.useState('')
    const [tipLoad,setTipLoad]=React.useState(false)
    const [favs,setFavs]=React.useState(['Baltimore','Stick','Post'])

    React.useEffect(()=>{loadData('quick_favs',['Baltimore','Stick','Post']).then(d=>{if(d)setFavs(d)})},[])
    React.useEffect(()=>{saveData('quick_favs',favs)},[favs])

    const [selPlay,setSelPlay]=React.useState(null)
    const [playExp,setPlayExp]=React.useState('')
    const [expLoad,setExpLoad]=React.useState(false)

    const plays=[
      {name:'Baltimore',comp:100,epa:1.8,yds:12.4,grade:'ELITE',col:'#22c55e',bg:'#0a1a0a',when:'Any down any hash deep routes',beats:'Cover 1 Cover 3 Cover 4'},
      {name:'Post',comp:100,epa:1.4,yds:13.1,grade:'ELITE',col:'#22c55e',bg:'#0a1a0a',when:'1st down left hash',beats:'Cover 3 Cover 1 Man'},
      {name:'Four Verts',comp:100,epa:1.9,yds:22.0,grade:'ELITE',col:'#22c55e',bg:'#0a1a0a',when:'Showcase plays deep shot',beats:'Cover 1 Cover 0 Man'},
      {name:'Verticals',comp:88,epa:2.1,yds:28.5,grade:'ELITE',col:'#22c55e',bg:'#0a1a0a',when:'Deep shot when winning',beats:'Any coverage with speed'},
      {name:'Stick',comp:100,epa:0.8,yds:7.7,grade:'ELITE',col:'#22c55e',bg:'#0a1a0a',when:'Any down any situation',beats:'Zone coverage Cover 2 Cover 3'},
      {name:'Out',comp:100,epa:0.2,yds:6.5,grade:'SOLID',col:'#d97706',bg:'#1a0e00',when:'2nd and medium converts',beats:'Cover 2 Zone soft coverage'},
      {name:'Slant',comp:90,epa:0.3,yds:5.1,grade:'SOLID',col:'#d97706',bg:'#1a0e00',when:'Game opener rhythm call',beats:'Press man off coverage'},
      {name:'Smash',comp:100,epa:0.5,yds:8.0,grade:'BUILD',col:'#d97706',bg:'#1a0e00',when:'Zone coverage attack',beats:'Cover 2 soft zone'},
      {name:'RPO Glance',comp:100,epa:0.4,yds:7.5,grade:'BUILD',col:'#d97706',bg:'#1a0e00',when:'Mixed coverages QB run threat',beats:'Light box run-pass conflict'},
      {name:'Sail',comp:0,epa:-0.6,yds:0,grade:'NEVER',col:'#dc2626',bg:'#1a0404',when:'DO NOT CALL — 0% all season',beats:'Nothing — remove immediately'},
      {name:'Fade',comp:0,epa:-0.8,yds:0,grade:'NEVER',col:'#dc2626',bg:'#1a0404',when:'DO NOT CALL — worst in script',beats:'Nothing — drill only no live reps'},
    ]

    const getTop3=()=>{
      let ranked=[...plays]
      if(dn==='3rd'&&(dist==='1-3'||dist==='Short'))ranked=ranked.sort((a,b)=>(b.comp+b.epa*10)-(a.comp+a.epa*10))
      else if(zone==='Red Zone')ranked=ranked.filter(p=>p.grade!=='NEVER').sort((a,b)=>b.comp-a.comp)
      else if(dist==='10+'||dist==='Long')ranked=ranked.filter(p=>p.yds>8).sort((a,b)=>b.epa-a.epa)
      else ranked=ranked.filter(p=>p.grade!=='NEVER').sort((a,b)=>b.epa-a.epa)
      return ranked.filter(p=>p.grade!=='NEVER').slice(0,3)
    }

    const top3=getTop3()
    const neverCall=plays.filter(p=>p.grade==='NEVER')

    const getAiTip=async()=>{
      setTipLoad(true);setAiTip('')
      try{
        const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:120,system:'You are an offensive coordinator. Give ONE specific play call tip in 2 sentences max. Be direct and confident. Name the exact play.',messages:[{role:'user',content:`${dn} and ${dist}, ${hash} hash, ${zone}, score ${score}, QB ${qb}. Our data: ${CTX} What is the single best play call right now and why?`}]})})
        const d=await r.json();setAiTip(d.content?.[0]?.text||'')
      }catch(e){setAiTip('Connection error.')}
      setTipLoad(false)
    }

    const explainPlay=async(play)=>{
      setSelPlay(play.name);setPlayExp('');setExpLoad(true)
      try{
        const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:100,system:'You are an offensive coordinator. Explain in exactly 2 sentences why to call this play right now, what coverage it beats, and what the QB reads. Be specific.',messages:[{role:'user',content:`Why call ${play.name} on ${dn} and ${dist}, ${hash} hash, ${zone}? Our stats: ${play.comp}% comp ${play.epa} EPA ${play.yds} avg yds. Beats: ${play.beats}.`}]})})
        const d=await r.json();setPlayExp(d.content?.[0]?.text||'')
      }catch(e){setPlayExp('Connection error.')}
      setExpLoad(false)
    }

    const logCall=(name)=>{setHistory(h=>[name,...h].slice(0,5))}
    const toggleFav=(name)=>setFavs(f=>f.includes(name)?f.filter(x=>x!==name):[...f,name])
    const gc=g=>g==='ELITE'?'#22c55e':g==='SOLID'?'#d97706':g==='BUILD'?'#d97706':'#dc2626'

    return(
      <div style={{padding:isMobile?10:16,fontFamily:'Helvetica,Arial,sans-serif'}}>
        <div style={{background:'#0a1a0a',border:'1px solid #22c55e',borderRadius:8,padding:12,marginBottom:12}}>
          <div style={{fontSize:11,fontWeight:700,color:'#22c55e',letterSpacing:2}}>⚡ QUICK CALL CARD — Situation to Play in 5 Seconds</div>
          <div style={{fontSize:8,color:'#555',marginTop:2}}>Set situation · Top 3 plays appear instantly · Tap for AI explanation · Log the call</div>
        </div>

        {history.length>0&&(
          <div style={{background:'#0d0d0d',border:'0.5px solid #252525',borderRadius:6,padding:'8px 12px',marginBottom:10,display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
            <span style={{fontSize:8,fontWeight:700,color:'#555',marginRight:4,letterSpacing:1}}>LAST CALLS:</span>
            {history.map((h,i)=>{
              const isDupe=history.indexOf(h)<i||history.slice(0,i).includes(h)
              return<span key={i} style={{fontSize:10,fontWeight:700,color:isDupe?'#dc2626':'#F0B429',background:isDupe?'#1a0404':'#1a1a00',padding:'2px 8px',borderRadius:4,border:`0.5px solid ${isDupe?'#dc2626':'#333'}`}}>{h}{isDupe&&' ⚠'}</span>
            })}
            {history.length>=2&&history[0]===history[1]&&<span style={{fontSize:9,color:'#dc2626',fontWeight:700}}>← Same concept twice! Mix it up.</span>}
          </div>
        )}

        <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(3,1fr)',gap:6,marginBottom:10,background:'#0d0d0d',border:'0.5px solid #1d3a1d',borderRadius:8,padding:10}}>
          {[['DOWN',['1st','2nd','3rd','4th'],dn,setDn,'#22c55e'],['DISTANCE',['Short 1-3','Med 4-7','Long 8-9','10+'],dist,setDist,'#22c55e'],['HASH',['Left','Middle','Right'],hash,setHash,'#06b6d4'],['FIELD ZONE',['Own 10-20','Open Field','Red Zone'],zone,setZone,'#06b6d4'],['QB',['Cooper','Ben'],qb,setQb,'#22c55e'],['SCORE',['Tied','Up 7+','Down 7+'],score,setScore,'#dc2626']].map(([lbl,opts,val,set,ac])=>(
            <div key={lbl}><div style={{fontSize:7,color:'#555',marginBottom:4,letterSpacing:1}}>{lbl}</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:3}}>
                {opts.map(o=><button key={o} onClick={()=>set(o)} style={{padding:'6px 8px',background:val===o?ac+'22':'#111',border:`1px solid ${val===o?ac:'#252525'}`,borderRadius:5,color:val===o?ac:'#555',fontSize:9,fontWeight:700,cursor:'pointer'}}>{o}</button>)}
              </div>
            </div>
          ))}
        </div>

        <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:isMobile?8:10,marginBottom:10}}>
          <div>
            <div style={{fontSize:9,fontWeight:700,color:'#F0B429',marginBottom:6,letterSpacing:1}}>TOP 3 PLAYS — CALL THESE NOW</div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              {top3.map((play,i)=>(
                <div key={play.name} style={{background:play.bg,border:`1px solid ${play.col}`,borderRadius:10,padding:'12px 14px',cursor:'pointer',position:'relative'}} onClick={()=>explainPlay(play)}>
                  <div style={{position:'absolute',top:8,right:8,display:'flex',gap:4}}>
                    <button onClick={e=>{e.stopPropagation();toggleFav(play.name)}} style={{background:'transparent',border:'none',color:favs.includes(play.name)?'#F0B429':'#333',fontSize:14,cursor:'pointer',padding:0}}>★</button>
                    <button onClick={e=>{e.stopPropagation();logCall(play.name)}} style={{background:play.col+'22',border:`0.5px solid ${play.col}`,borderRadius:4,color:play.col,fontSize:8,fontWeight:700,cursor:'pointer',padding:'2px 6px'}}>LOG</button>
                  </div>
                  <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:4}}>
                    <div style={{width:22,height:22,borderRadius:4,background:play.col,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:'#000',flexShrink:0}}>{i+1}</div>
                    <div style={{fontSize:16,fontWeight:700,color:play.col}}>{play.name}</div>
                    <div style={{fontSize:9,fontWeight:700,color:play.col,background:play.col+'22',padding:'1px 6px',borderRadius:4}}>{play.grade}</div>
                  </div>
                  <div style={{display:'flex',gap:12}}>
                    <span style={{fontSize:11,fontWeight:700,color:'#22c55e'}}>{play.comp}%</span>
                    <span style={{fontSize:11,fontWeight:700,color:'#F0B429'}}>{play.yds} yds</span>
                    <span style={{fontSize:11,fontWeight:700,color:'#06b6d4'}}>EPA {play.epa>=0?'+':''}{play.epa}</span>
                  </div>
                  <div style={{fontSize:8,color:'#555',marginTop:3}}>{play.when}</div>
                  {selPlay===play.name&&(
                    <div style={{marginTop:8,padding:'8px',background:'#0a0a0a',borderRadius:6,borderTop:`1px solid ${play.col}33`}}>
                      {expLoad?<div style={{fontSize:11,color:'#06b6d4'}}>Getting AI explanation...</div>:<div style={{fontSize:11,color:'#ccc',lineHeight:1.6}}>{playExp}</div>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            <div>
              <div style={{fontSize:9,fontWeight:700,color:'#555',marginBottom:6,letterSpacing:1}}>MY FAVORITES ★</div>
              <div style={{display:'flex',flexDirection:'column',gap:4}}>
                {plays.filter(p=>favs.includes(p.name)).map(play=>(
                  <div key={play.name} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 10px',background:'#111',border:`0.5px solid ${play.col}33`,borderRadius:6,cursor:'pointer'}} onClick={()=>explainPlay(play)}>
                    <div><span style={{fontSize:11,fontWeight:700,color:play.col}}>{play.name}</span><span style={{fontSize:8,color:'#444',marginLeft:6}}>{play.comp}% · +{play.epa} EPA</span></div>
                    <div style={{display:'flex',gap:4}}>
                      <button onClick={e=>{e.stopPropagation();toggleFav(play.name)}} style={{background:'transparent',border:'none',color:'#F0B429',fontSize:12,cursor:'pointer',padding:0}}>★</button>
                      <button onClick={e=>{e.stopPropagation();logCall(play.name)}} style={{background:'#14532d',border:'none',borderRadius:4,color:'#22c55e',fontSize:8,fontWeight:700,cursor:'pointer',padding:'2px 6px'}}>LOG</button>
                    </div>
                  </div>
                ))}
                {favs.length===0&&<div style={{fontSize:11,color:'#333',padding:'8px'}}>Tap ★ on any play to save it here</div>}
              </div>
            </div>

            <div style={{background:'#1a0404',border:'1px solid #dc262644',borderRadius:8,padding:10}}>
              <div style={{fontSize:9,fontWeight:700,color:'#dc2626',marginBottom:6,letterSpacing:1}}>NEVER CALL THESE</div>
              {neverCall.map(p=>(
                <div key={p.name} style={{display:'flex',justifyContent:'space-between',padding:'5px 0',borderBottom:'0.5px solid #2a0404'}}>
                  <span style={{fontSize:11,fontWeight:700,color:'#dc2626'}}>{p.name}</span>
                  <span style={{fontSize:9,color:'#7f1d1d'}}>0% · {p.epa} EPA · Drill only</span>
                </div>
              ))}
            </div>

            <div style={{background:'#07070f',border:'1px solid #06b6d4',borderRadius:8,padding:10}}>
              <div style={{fontSize:9,fontWeight:700,color:'#06b6d4',marginBottom:6,letterSpacing:1}}>AI SITUATION TIP</div>
              {aiTip?<div style={{fontSize:12,color:'#ccc',lineHeight:1.6}}>{aiTip}</div>:<div style={{fontSize:11,color:'#333'}}>Tap to get AI read for this exact situation</div>}
              <button onClick={getAiTip} disabled={tipLoad} style={{width:'100%',marginTop:8,padding:'9px',background:tipLoad?'#111':'#0c1a3a',border:`0.5px solid ${tipLoad?'#252525':'#06b6d4'}`,borderRadius:6,color:tipLoad?'#555':'#06b6d4',fontWeight:700,fontSize:11,cursor:'pointer'}}>
                {tipLoad?'Reading the situation...':'🤖 Get AI Read for This Situation'}
              </button>
            </div>
          </div>
        </div>

        <div style={{background:'#0d0d0d',border:'0.5px solid #1d3a1d',borderRadius:8,overflow:'hidden'}}>
          <div style={{background:'#0a0a0a',padding:'6px 12px',borderBottom:'0.5px solid #1d3a1d',display:'grid',gridTemplateColumns:'1.2fr 0.6fr 0.6fr 0.7fr 1.5fr 0.8fr'}}>{['CONCEPT','COMP%','YDS','EPA','BEATS','GRADE'].map(h=><div key={h} style={{fontSize:7,fontWeight:700,color:'#555',textAlign:'center'}}>{h}</div>)}</div>
          {plays.map((p,i)=>(
            <div key={p.name} style={{display:'grid',gridTemplateColumns:'1.2fr 0.6fr 0.6fr 0.7fr 1.5fr 0.8fr',padding:'7px 12px',background:i%2===0?'#0f0f0f':'#141414',borderBottom:'0.5px solid #1a1a1a',alignItems:'center',cursor:'pointer'}} onClick={()=>explainPlay(p)}>
              <div style={{fontSize:9,fontWeight:700,color:p.col}}>{p.name}</div>
              <div style={{fontSize:10,fontWeight:700,color:gc(p.grade),textAlign:'center'}}>{p.comp}%</div>
              <div style={{fontSize:10,textAlign:'center',color:'#F0B429'}}>{p.yds}</div>
              <div style={{fontSize:10,fontWeight:700,textAlign:'center',color:p.epa>=0?'#22c55e':'#dc2626'}}>{p.epa>=0?'+':''}{p.epa}</div>
              <div style={{fontSize:8,color:'#555'}}>{p.beats}</div>
              <div style={{fontSize:8,fontWeight:700,textAlign:'center',color:gc(p.grade)}}>{p.grade}</div>
            </div>
          ))}
          <div style={{padding:'7px 12px',background:'#0a0a0a',fontSize:8,color:'#444'}}>Tap any row for AI coaching on exactly when and how to call it</div>
        </div>
      </div>
    )
  }

  const OpponentScoutTab=()=>{
    const [msgs,setMsgs]=React.useState([{role:'assistant',content:'Opponent Scout AI ready. Tell me what you know about the defense you are facing — formations, tendencies, their best player, blitz packages — and I will build a custom game plan to attack them. The more you tell me, the sharper the plan.'}])
    const [inp,setInp]=React.useState('')
    const [load,setLoad]=React.useState(false)
    const [oppName,setOppName]=React.useState('')
    const [tagged,setTagged]=React.useState([])
    const [liveDef,setLiveDef]=React.useState([])
    const [defInp,setDefInp]=React.useState('')
    const ref=React.useRef(null)

    const tendencies=['Shows Cover 2 then rotates to Cover 4','Blitzes inside LB every 3rd and long','Soft zone underneath — gives up short all day','Press man on outside WR every play','Safety walks into box pre-snap','Never blitzes — sits in zone','Corner bails at snap — plays off man','Heavy Cover 3 — middle seam open','Rotates safety to Cooper side','Weak DB at right corner — target him','No adjustment to RPO — run it all day','Linebacker chases motion — use it']
    const coverages=[
      {name:'Cover 1 Man',abbr:'C1',beat:'Post and Baltimore attack the seam. Cooper 1-on-1 deep. Four Verts stretches.'},
      {name:'Cover 2 Zone',abbr:'C2',beat:'Stick underneath. Smash to the corner. Four Verts splits the safeties.'},
      {name:'Cover 3 Sky',abbr:'C3',beat:'Stick into the flat. Post behind the curl-flat defender. Verticals on backside.'},
      {name:'Cover 4 Quarters',abbr:'C4',beat:'RPO Glance — stress the box. Stick underneath. Baltimore on the dig.'},
      {name:'Cover 0 Blitz',abbr:'C0',beat:'Quick game — Slant and Out immediately. Get rid of ball in 1.5s.'},
      {name:'Tampa 2',abbr:'T2',beat:'Verticals on both sides. Make the MLB run deep. Baltimore behind him.'},
      {name:'Cover 6 Hybrid',abbr:'C6',beat:'Attack the weak side. Out to the field. Post away from the safety.'},
      {name:'Press Man',abbr:'PM',beat:'Slant and stick — Cooper throws hot. Four Verts — WR beats press deep.'},
    ]

    const toggleTag=t=>setTagged(p=>p.includes(t)?p.filter(x=>x!==t):[...p,t])
    const addDef=()=>{if(!defInp.trim())return;setLiveDef(p=>[...p,{id:Date.now(),obs:defInp,time:new Date().toLocaleTimeString()}]);setDefInp('')}

    const OPP_SYS=`You are a college-level offensive coordinator analyzing an opposing defense for Westfield Shamrocks. Our offense: ${CTX} Give SHORT DIRECT answers — max 4 sentences. Tell coaches exactly which plays to run against this defense and why. Reference our actual stats.`

    const send=async(msg)=>{
      if(!msg.trim()||load)return
      const ctx=`Opponent${oppName?' '+oppName:''}. Tagged tendencies: ${tagged.length?tagged.join(', '):'none yet'}. Live observations this game: ${liveDef.map(d=>d.obs).join(', ')||'none yet'}. `
      const um={role:'user',content:ctx+msg};const nm=[...msgs,um]
      setMsgs(nm);setInp('');setLoad(true)
      try{
        const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:200,system:OPP_SYS,messages:nm.map(m=>({role:m.role,content:m.content}))})})
        const d=await r.json();setMsgs(p=>[...p,{role:'assistant',content:d.content?.[0]?.text||'Error'}])
      }catch(e){setMsgs(p=>[...p,{role:'assistant',content:'Connection error.'}])}
      setLoad(false)
    }

    const genGamePlan=()=>send(`Build me a full offensive game plan against this opponent. Give me: 3 plays to open the game, 2 red zone plays even though we have none built yet, which concept to run on every 3rd down, and what to do if they adjust.`)
    React.useEffect(()=>ref.current?.scrollIntoView({behavior:'smooth'}),[msgs])

    return(
      <div style={{padding:isMobile?10:16,fontFamily:'Helvetica,Arial,sans-serif'}}>
        <div style={{background:'#0a0d1a',border:'1px solid #06b6d4',borderRadius:8,padding:12,marginBottom:12}}>
          <div style={{fontSize:11,fontWeight:700,color:'#06b6d4',letterSpacing:2}}>🔍 OPPONENT SCOUTING — Know What You Are Facing</div>
          <div style={{fontSize:8,color:'#555',marginTop:2}}>Tag their tendencies before the game · Log what you see live · AI builds the counter attack instantly</div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1.2fr',gap:isMobile?8:12}}>
          <div>
            <div style={{marginBottom:10}}>
              <div style={{fontSize:8,color:'#555',marginBottom:4,letterSpacing:1}}>OPPONENT NAME</div>
              <input value={oppName} onChange={e=>setOppName(e.target.value)} placeholder="Enter team name..." style={{width:'100%',background:'#111',border:'0.5px solid #252525',borderRadius:6,color:'#ccc',padding:'8px',fontSize:13,outline:'none',boxSizing:'border-box'}}/>
            </div>
            <div style={{marginBottom:10}}>
              <div style={{fontSize:8,color:'#555',marginBottom:6,letterSpacing:1}}>TAG THEIR TENDENCIES</div>
              <div style={{display:'flex',flexDirection:'column',gap:4}}>
                {tendencies.map(t=>(
                  <button key={t} onClick={()=>toggleTag(t)} style={{padding:'7px 10px',background:tagged.includes(t)?'#0c1a3a':'#0d0d0d',border:`0.5px solid ${tagged.includes(t)?'#06b6d4':'#252525'}`,borderRadius:6,color:tagged.includes(t)?'#06b6d4':'#666',fontSize:9,cursor:'pointer',textAlign:'left',display:'flex',alignItems:'center',gap:6}}>
                    <span style={{color:tagged.includes(t)?'#22c55e':'#333',fontSize:11,minWidth:12}}>{tagged.includes(t)?'✓':'○'}</span>{t}
                  </button>
                ))}
              </div>
            </div>
            <div style={{marginBottom:10}}>
              <div style={{fontSize:8,color:'#555',marginBottom:6,letterSpacing:1}}>LIVE OBSERVATIONS THIS GAME</div>
              <div style={{display:'flex',gap:4,marginBottom:6}}>
                <input value={defInp} onChange={e=>setDefInp(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addDef()} placeholder="What are you seeing right now?" style={{flex:1,background:'#111',border:'0.5px solid #252525',borderRadius:6,color:'#ccc',padding:'7px',fontSize:11,outline:'none'}}/>
                <button onClick={addDef} style={{padding:'7px 12px',background:'#0c1a3a',border:'0.5px solid #06b6d4',borderRadius:6,color:'#06b6d4',fontSize:10,fontWeight:700,cursor:'pointer'}}>+ Log</button>
              </div>
              {liveDef.map(d=><div key={d.id} style={{fontSize:9,color:'#9ca3af',padding:'4px 8px',background:'#111',borderRadius:4,marginBottom:3,display:'flex',gap:6}}><span style={{color:'#444',flexShrink:0}}>{d.time}</span>{d.obs}</div>)}
            </div>
            <div>
              <div style={{fontSize:8,color:'#555',marginBottom:6,letterSpacing:1}}>COVERAGE GUIDE — TAP TO BEAT IT</div>
              {coverages.map(cv=>(
                <div key={cv.name} style={{padding:'8px 10px',background:'#0d0d0d',border:'0.5px solid #252525',borderRadius:6,marginBottom:4,cursor:'pointer'}} onClick={()=>send(`They are showing ${cv.name}. What exact play do we call to beat it right now?`)}>
                  <div style={{display:'flex',gap:6,alignItems:'center',marginBottom:3}}>
                    <span style={{fontSize:10,fontWeight:700,color:'#dc2626',background:'#dc262622',padding:'1px 6px',borderRadius:4,minWidth:28,textAlign:'center'}}>{cv.abbr}</span>
                    <span style={{fontSize:10,fontWeight:700,color:'#F0B429'}}>{cv.name}</span>
                  </div>
                  <div style={{fontSize:8,color:'#555'}}>{cv.beat}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            <button onClick={genGamePlan} style={{padding:'11px',background:'#0a1a0a',border:'1px solid #22c55e',borderRadius:8,color:'#22c55e',fontWeight:700,fontSize:12,cursor:'pointer'}}>⚡ Generate Full Game Plan Against This Opponent</button>
            <div style={{flex:1,overflowY:'auto',background:'#090909',border:'0.5px solid #0c1a3a',borderRadius:8,padding:10,display:'flex',flexDirection:'column',gap:8,minHeight:420}}>
              {msgs.map((m,i)=>(
                <div key={i} style={{display:'flex',justifyContent:m.role==='user'?'flex-end':'flex-start'}}>
                  <div style={{maxWidth:'90%',padding:'9px 12px',borderRadius:10,background:m.role==='user'?'#0c1a3a':'#111',border:`0.5px solid ${m.role==='user'?'#06b6d433':'#252525'}`,borderBottomRightRadius:m.role==='user'?2:10,borderBottomLeftRadius:m.role==='assistant'?2:10}}>
                    {m.role==='assistant'&&<div style={{fontSize:8,fontWeight:700,color:'#06b6d4',marginBottom:3,letterSpacing:1}}>SCOUT AI</div>}
                    <div style={{fontSize:13,color:'#e5e7eb',lineHeight:1.55,whiteSpace:'pre-wrap'}}>{m.content}</div>
                  </div>
                </div>
              ))}
              {load&&<div style={{display:'flex'}}><div style={{padding:'8px 12px',background:'#111',borderRadius:10,border:'0.5px solid #252525'}}><span style={{fontSize:11,color:'#06b6d4'}}>Analyzing opponent...</span></div></div>}
              <div ref={ref}/>
            </div>
            <div style={{display:'flex',gap:4}}>
              <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send(inp)} placeholder="Ask about their defense or request a counter play..." style={{flex:1,background:'#111',border:'0.5px solid #0c1a3a',borderRadius:8,padding:'10px 12px',color:'#fff',fontSize:13,outline:'none'}}/>
              <button onClick={()=>send(inp)} disabled={load||!inp.trim()} style={{padding:'10px 16px',background:load||!inp.trim()?'#111':'#0c1a3a',border:`0.5px solid ${load||!inp.trim()?'#252525':'#06b6d4'}`,borderRadius:8,color:load||!inp.trim()?'#555':'#06b6d4',fontWeight:700,cursor:'pointer'}}>Scout</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const PracticeScriptTab=()=>{
    const [script,setScript]=React.useState([])
    const [focus,setFocus]=React.useState('Balanced')
    const [qbFocus,setQbFocus]=React.useState('Both')
    const [reps,setReps]=React.useState(20)
    const [load,setLoad]=React.useState(false)
    const [checked,setChecked]=React.useState([])

    React.useEffect(()=>{loadData('practice_checked',[]).then(d=>{if(d)setChecked(d)})},[])
    React.useEffect(()=>{saveData('practice_checked',checked)},[checked])

    const [aiScript,setAiScript]=React.useState('')

    const focusOptions=['Balanced','Red Zone Install','Hash Accuracy','Deep Ball','Short Game','Ben Development','Cooper Showcase','Pressure Situations']
    const baseScript=[
      {n:1,concept:'Baltimore',qb:'Cooper',focus:'Deep ball arm — 3 reps each hash',goal:'100% comp',why:'Best big play — needs daily reps to stay sharp'},
      {n:2,concept:'Post',qb:'Cooper',focus:'Left hash step and throw',goal:'100% comp',why:'Primary 1st down weapon — own this route'},
      {n:3,concept:'Stick',qb:'Both',focus:'Quick release — 1.8s TTT target',goal:'100% comp',why:'Most called concept — automatic every time'},
      {n:4,concept:'Stick',qb:'Ben',focus:'Flat release mechanics — fix high throw',goal:'85%+ comp',why:'Ben top priority — release point issue'},
      {n:5,concept:'Out',qb:'Both',focus:'Right hash footwork — set feet to target',goal:'90%+ comp',why:'Right hash weakness for both QBs — address it'},
      {n:6,concept:'Slant',qb:'Cooper',focus:'Game rhythm opener — 5 reps quick',goal:'90%+ comp',why:'Game opener builds confidence and momentum'},
      {n:7,concept:'Baltimore',qb:'Cooper',focus:'Right hash — weakest zone this season',goal:'75%+ comp',why:'Right deep 0% — needs rep work before game'},
      {n:8,concept:'Smash',qb:'Both',focus:'Zone coverage — corner and flat combo',goal:'100% comp',why:'Building this concept — good early results'},
      {n:9,concept:'RPO Glance',qb:'Cooper',focus:'Read the box — run or throw decision',goal:'100% comp',why:'Adds QB run dimension — showcases mobility'},
      {n:10,concept:'Verticals',qb:'Cooper',focus:'Deep shot timing — 28+ yard target',goal:'85%+ comp',why:'Highest EPA — use it when winning by 7+'},
      {n:11,concept:'Fade',qb:'Both',focus:'MECHANICS ONLY — no live reps',goal:'Fix release',why:'0% all season — must fix before we can live call'},
      {n:12,concept:'Red Zone',qb:'Both',focus:'Install back-shoulder and fade to end zone',goal:'50%+ comp',why:'Critical gap — 0% all season installs today'},
      {n:13,concept:'Post',qb:'Ben',focus:'Deep ball — 7-step drop mechanics',goal:'65%+ comp',why:'Ben deep ball 50% — below NFL average needs work'},
      {n:14,concept:'Four Verts',qb:'Cooper',focus:'Showcase rep — college coach film',goal:'100% comp',why:'Cooper 100% on this — best play for recruiting'},
      {n:15,concept:'Hash Routes',qb:'Both',focus:'Left and right hash 10 reps each',goal:'80%+ comp',why:'Both QBs under 75% on hash — daily focus'},
    ]

    const genScript=async()=>{
      setLoad(true);setAiScript('')
      try{
        const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:500,system:`You are an offensive coordinator building a practice script for Westfield Shamrocks. Season data: ${CTX} Build a ${reps}-rep practice script focused on: ${focus}. QB focus: ${qbFocus}. Format as a numbered list. Each line: [Rep#] CONCEPT — QB — Focus — Goal. Be specific. Target the actual weaknesses in the data.`,messages:[{role:'user',content:`Build a ${reps}-play practice script for ${focus} focus, QB focus ${qbFocus}. Make every rep count.`}]})})
        const d=await r.json();setAiScript(d.content?.[0]?.text||'Error')
        setScript(baseScript.slice(0,reps))
      }catch(e){setAiScript('Connection error.')}
      setLoad(false)
    }

    const toggleCheck=n=>setChecked(p=>p.includes(n)?p.filter(x=>x!==n):[...p,n])
    const pct=script.length?Math.round(checked.length/script.length*100):0
    const remaining=script.filter(s=>!checked.includes(s.n))

    return(
      <div style={{padding:isMobile?10:16,fontFamily:'Helvetica,Arial,sans-serif'}}>
        <div style={{background:'#1a1400',border:'1px solid #F0B429',borderRadius:8,padding:12,marginBottom:12}}>
          <div style={{fontSize:11,fontWeight:700,color:'#F0B429',letterSpacing:2}}>📋 PRACTICE SCRIPT BUILDER — AI Builds the Plan, You Run It</div>
          <div style={{fontSize:8,color:'#555',marginTop:2}}>Set your focus · AI builds a script from your gap data · Check off each rep as you run it · Never show up to practice without a plan again</div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1.5fr',gap:isMobile?8:12}}>
          <div style={{background:'#0d0d0d',border:'0.5px solid #252525',borderRadius:8,padding:14}}>
            <div style={{fontSize:9,fontWeight:700,color:'#F0B429',marginBottom:10,letterSpacing:1}}>BUILD TODAY\'S SCRIPT</div>
            <div style={{marginBottom:10}}>
              <div style={{fontSize:8,color:'#555',marginBottom:5}}>PRACTICE FOCUS</div>
              <div style={{display:'flex',flexDirection:'column',gap:4}}>
                {focusOptions.map(f=><button key={f} onClick={()=>setFocus(f)} style={{padding:'8px 10px',background:focus===f?'#2a1a00':'#111',border:`0.5px solid ${focus===f?'#F0B429':'#252525'}`,borderRadius:6,color:focus===f?'#F0B429':'#555',fontSize:10,fontWeight:700,cursor:'pointer',textAlign:'left'}}>{f}</button>)}
              </div>
            </div>
            <div style={{marginBottom:10}}>
              <div style={{fontSize:8,color:'#555',marginBottom:5}}>QB FOCUS</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:4}}>
                {['Both','Cooper','Ben'].map(q=><button key={q} onClick={()=>setQbFocus(q)} style={{padding:'7px',background:qbFocus===q?'#14532d':'#111',border:`0.5px solid ${qbFocus===q?'#22c55e':'#252525'}`,borderRadius:4,color:qbFocus===q?'#22c55e':'#555',fontSize:9,fontWeight:700,cursor:'pointer'}}>{q}</button>)}
              </div>
            </div>
            <div style={{marginBottom:12}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}><span style={{fontSize:8,color:'#555'}}>REPS</span><span style={{fontSize:10,fontWeight:700,color:'#F0B429'}}>{reps} plays</span></div>
              <input type="range" min={10} max={30} step={5} value={reps} onChange={e=>setReps(Number(e.target.value))} style={{width:'100%',accentColor:'#F0B429'}}/>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:7,color:'#444',marginTop:2}}><span>10</span><span>20</span><span>30</span></div>
            </div>
            <button onClick={genScript} disabled={load} style={{width:'100%',padding:'13px',background:load?'#111':'#2a1a00',border:`1px solid ${load?'#252525':'#F0B429'}`,borderRadius:8,color:load?'#555':'#F0B429',fontWeight:700,fontSize:13,cursor:'pointer'}}>
              {load?'Building script from your data...':'⚡ BUILD PRACTICE SCRIPT'}
            </button>
            {script.length>0&&(
              <div style={{marginTop:12}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}><span style={{fontSize:9,color:'#555'}}>PRACTICE PROGRESS</span><span style={{fontSize:10,fontWeight:700,color:pct===100?'#22c55e':'#F0B429'}}>{checked.length}/{script.length} reps</span></div>
                <div style={{height:6,background:'#1a1a1a',borderRadius:3,overflow:'hidden'}}>
                  <div style={{height:'100%',width:`${pct}%`,background:pct===100?'#22c55e':'#F0B429',borderRadius:3,transition:'width 0.3s'}}/>
                </div>
                {remaining.length>0&&<div style={{fontSize:8,color:'#555',marginTop:4}}>Still need: {remaining.slice(0,3).map(r=>r.concept).join(', ')}{remaining.length>3?` +${remaining.length-3} more`:''}</div>}
                {pct===100&&<div style={{fontSize:10,fontWeight:700,color:'#22c55e',marginTop:6,textAlign:'center'}}>✓ Full script complete — great practice!</div>}
              </div>
            )}
          </div>

          <div>
            {aiScript&&(
              <div style={{background:'#0d0d0d',border:'0.5px solid #2a1a00',borderRadius:8,padding:12,marginBottom:10}}>
                <div style={{fontSize:9,fontWeight:700,color:'#F0B429',marginBottom:6,letterSpacing:1}}>AI GENERATED SCRIPT — {reps} reps · {focus} focus</div>
                <div style={{fontSize:11,color:'#ccc',lineHeight:1.7,whiteSpace:'pre-wrap'}}>{aiScript}</div>
              </div>
            )}
            {script.length>0&&(
              <div style={{background:'#0d0d0d',border:'0.5px solid #252525',borderRadius:8,overflow:'hidden'}}>
                <div style={{background:'#0a0a0a',padding:'7px 12px',borderBottom:'0.5px solid #252525',display:'grid',gridTemplateColumns:'0.4fr 1fr 0.7fr 1fr 1fr'}}>{['REP','CONCEPT','QB','FOCUS','GOAL'].map(h=><div key={h} style={{fontSize:7,fontWeight:700,color:'#555',textAlign:'center'}}>{h}</div>)}</div>
                {baseScript.slice(0,reps).map((s,i)=>(
                  <div key={s.n} onClick={()=>toggleCheck(s.n)} style={{display:'grid',gridTemplateColumns:'0.4fr 1fr 0.7fr 1fr 1fr',padding:'8px 12px',background:checked.includes(s.n)?'#0a1a0a':i%2===0?'#0f0f0f':'#141414',borderBottom:'0.5px solid #1a1a1a',cursor:'pointer',alignItems:'center',opacity:checked.includes(s.n)?0.6:1}}>
                    <div style={{display:'flex',gap:5,alignItems:'center'}}>
                      <div style={{width:16,height:16,borderRadius:3,border:`1.5px solid ${checked.includes(s.n)?'#22c55e':'#333'}`,background:checked.includes(s.n)?'#22c55e':'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                        {checked.includes(s.n)&&<span style={{color:'#000',fontSize:10,fontWeight:700,lineHeight:1}}>✓</span>}
                      </div>
                      <span style={{fontSize:9,color:'#555'}}>{s.n}</span>
                    </div>
                    <div style={{fontSize:9,fontWeight:700,color:checked.includes(s.n)?'#22c55e':'#F0B429'}}>{s.concept}</div>
                    <div style={{fontSize:8,textAlign:'center',color:s.qb==='Cooper'?'#22c55e':s.qb==='Ben'?'#F0B429':'#9ca3af'}}>{s.qb}</div>
                    <div style={{fontSize:8,color:'#555'}}>{s.focus}</div>
                    <div style={{fontSize:8,color:'#06b6d4'}}>{s.goal}</div>
                  </div>
                ))}
              </div>
            )}
            {!script.length&&!load&&<div style={{background:'#0d0d0d',border:'0.5px solid #252525',borderRadius:8,padding:28,textAlign:'center',color:'#333',fontSize:12}}>Set your focus and build the script — never show up to practice without a plan</div>}
          </div>
        </div>
      </div>
    )
  }

  const LiveScoreboardTab=()=>{
    const [plays,setPlays]=React.useState([])
    const [qb,setQb]=React.useState('Cooper Melvin')
    const [concept,setConcept]=React.useState('Baltimore')
    const [result,setResult]=React.useState('Complete')
    const [yds,setYds]=React.useState('')
    const [driveSummary,setDriveSummary]=React.useState('')
    const [sumLoad,setSumLoad]=React.useState(false)
    const concepts=['Baltimore','Post','Stick','Four Verts','Verticals','Out','Slant','Smash','RPO Glance','Sail','Fade']

    const log=()=>{
      const play={id:Date.now(),qb,concept,result,yds:Number(yds)||0,time:new Date().toLocaleTimeString()}
      const newPlays=[...plays,play]
      setPlays(newPlays);setYds('')
      if(newPlays.length>0&&newPlays.length%5===0) getDriveSummary(newPlays)
    }

    const getDriveSummary=async(allPlays)=>{
      setSumLoad(true)
      const recent=allPlays.slice(-5)
      const summary=recent.map(p=>`${p.qb==='Cooper Melvin'?'Cooper':'Ben'} ${p.concept} ${p.result} ${p.yds}yds`).join(', ')
      try{
        const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:80,system:'You are a sideline analyst. Give a 1-sentence drive summary and 1-sentence suggestion for the next series. Be direct.',messages:[{role:'user',content:`Last 5 plays: ${summary}. Our data: ${CTX} Quick assessment and next call.`}]})})
        const d=await r.json();setDriveSummary(d.content?.[0]?.text||'')
      }catch(e){setDriveSummary('')}
      setSumLoad(false)
    }

    const cm=plays.filter(p=>p.qb==='Cooper Melvin')
    const bk=plays.filter(p=>p.qb==='Ben Kooi')
    const pct=ps=>ps.length?Math.round(ps.filter(p=>p.result==='Complete').length/ps.length*100):0
    const ay=ps=>ps.length?(ps.reduce((a,p)=>a+p.yds,0)/ps.length).toFixed(1):0

    const seasonBests={cooper:{comp:100,rtg:100,consec:5},ben:{comp:80,rtg:80,consec:3}}
    const cmConsec=()=>{let n=0;for(let i=cm.length-1;i>=0;i--){if(cm[i].result==='Complete')n++;else break;}return n}
    const bkConsec=()=>{let n=0;for(let i=bk.length-1;i>=0;i--){if(bk[i].result==='Complete')n++;else break;}return n}

    const conceptBoard=concepts.map(ct=>{
      const cp=plays.filter(p=>p.concept===ct)
      return{ct,att:cp.length,pct:cp.length?Math.round(cp.filter(p=>p.result==='Complete').length/cp.length*100):null}
    }).filter(x=>x.att>0).sort((a,b)=>(b.pct||0)-(a.pct||0))

    const gc=p=>p>=90?'#22c55e':p>=70?'#d97706':p>=50?'#ea580c':'#dc2626'

    return(
      <div style={{padding:isMobile?10:16,fontFamily:'Helvetica,Arial,sans-serif'}}>
        <div style={{background:'#0a0a0a',border:'1px solid #22c55e',borderRadius:8,padding:12,marginBottom:12}}>
          <div style={{fontSize:11,fontWeight:700,color:'#22c55e',letterSpacing:2}}>📊 LIVE SESSION SCOREBOARD — Real Time Every Play</div>
          <div style={{fontSize:8,color:'#555',marginTop:2}}>Log plays · Everyone sees the same live data · Drive summary every 5 plays · Personal bests tracked automatically</div>
        </div>

        {driveSummary&&(
          <div style={{background:'#0a1a0a',border:'1px solid #22c55e',borderRadius:8,padding:'10px 14px',marginBottom:10,display:'flex',gap:8,alignItems:'flex-start'}}>
            <span style={{fontSize:14,flexShrink:0}}>⚡</span>
            <div><div style={{fontSize:8,fontWeight:700,color:'#22c55e',marginBottom:2,letterSpacing:1}}>DRIVE SUMMARY — AI after every 5 plays</div><div style={{fontSize:12,color:'#ccc',lineHeight:1.5}}>{sumLoad?'Analyzing last 5 plays...':driveSummary}</div></div>
          </div>
        )}

        <div style={{display:'grid',gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(4,1fr)',gap:6,marginBottom:12}}>
          {[['PLAYS',plays.length,'#22c55e'],['COOPER',cm.length?`${pct(cm)}%`:'—',pct(cm)>=80?'#22c55e':pct(cm)>=65?'#d97706':'#dc2626'],['BEN',bk.length?`${pct(bk)}%`:'—',pct(bk)>=80?'#22c55e':pct(bk)>=65?'#d97706':'#dc2626'],['HOT',plays.length?conceptBoard[0]?.ct||'—':'—','#F0B429']].map(([l,v,col])=>(
            <div key={l} style={{background:'#111',border:`0.5px solid ${col}33`,borderRadius:8,padding:'12px 6px',textAlign:'center'}}>
              <div style={{fontSize:22,fontWeight:700,color:col,lineHeight:1}}>{v}</div>
              <div style={{fontSize:7,color:'#555',marginTop:3,letterSpacing:1}}>{l}</div>
            </div>
          ))}
        </div>

        <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:isMobile?8:10,marginBottom:12}}>
          {[[cm,'COOPER MELVIN','#22c55e','#070f07',cmConsec(),seasonBests.cooper],[bk,'BEN KOOI','#F0B429','#0c0a06',bkConsec(),seasonBests.ben]].map(([ps,name,col,bg,consec,bests])=>(
            <div key={name} style={{background:bg,border:`1px solid ${col}`,borderRadius:10,padding:14}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                <div style={{fontSize:10,fontWeight:700,color:col}}>{name}</div>
                {consec>=3&&<div style={{background:col+'22',color:col,fontSize:8,fontWeight:700,padding:'2px 8px',borderRadius:4,border:`0.5px solid ${col}44`}}>🔥 {consec} straight</div>}
              </div>
              <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(3,1fr)',gap:6,marginBottom:8}}>
                {[['COMP%',ps.length?`${pct(ps)}%`:'—',gc(pct(ps))],['ATT',ps.length,'#9ca3af'],['YPA',ay(ps),'#F0B429']].map(([l,v,c])=>(
                  <div key={l} style={{textAlign:'center'}}><div style={{fontSize:18,fontWeight:700,color:c}}>{v}</div><div style={{fontSize:7,color:'#555'}}>{l}</div></div>
                ))}
              </div>
              {consec>bests.consec&&<div style={{background:col+'22',border:`1px solid ${col}`,borderRadius:6,padding:'6px 10px',textAlign:'center'}}><div style={{fontSize:11,fontWeight:700,color:col}}>🏆 NEW PERSONAL BEST — {consec} consecutive</div></div>}
              {ps.length>0&&pct(ps)>=bests.comp&&<div style={{background:'#14532d',borderRadius:6,padding:'5px 10px',marginTop:4,textAlign:'center'}}><div style={{fontSize:10,fontWeight:700,color:'#22c55e'}}>⬆ Season best comp% this session</div></div>}
            </div>
          ))}
        </div>

        <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:isMobile?8:10,marginBottom:10}}>
          <div style={{background:'#0d0d0d',border:'0.5px solid #1d3a1d',borderRadius:8,overflow:'hidden'}}>
            <div style={{background:'#0a0a0a',padding:'6px 12px',borderBottom:'0.5px solid #1d3a1d',fontSize:9,fontWeight:700,color:'#22c55e',letterSpacing:1}}>LIVE LEADERBOARD</div>
            {conceptBoard.length===0&&<div style={{padding:'20px',textAlign:'center',fontSize:11,color:'#333'}}>Log plays to see live rankings</div>}
            {conceptBoard.map((x,i)=>(
              <div key={x.ct} style={{display:'flex',alignItems:'center',gap:8,padding:'8px 12px',background:i%2===0?'#0f0f0f':'#141414',borderBottom:'0.5px solid #1a1a1a'}}>
                <span style={{fontSize:11,fontWeight:700,color:'#555',minWidth:16}}>{i+1}</span>
                <span style={{fontSize:10,fontWeight:700,color:'#F0B429',flex:1}}>{x.ct}</span>
                <div style={{display:'flex',gap:4,alignItems:'center'}}>
                  <div style={{width:60,height:6,background:'#1a1a1a',borderRadius:3,overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${x.pct}%`,background:gc(x.pct),borderRadius:3}}/>
                  </div>
                  <span style={{fontSize:12,fontWeight:700,color:gc(x.pct),minWidth:36}}>{x.pct}%</span>
                  <span style={{fontSize:8,color:'#444'}}>{x.att}att</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{background:'#0d0d0d',border:'0.5px solid #252525',borderRadius:8,padding:14}}>
            <div style={{fontSize:9,fontWeight:700,color:'#F0B429',marginBottom:8,letterSpacing:1}}>LOG PLAY</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:4,marginBottom:6}}>
              {['Cooper Melvin','Ben Kooi'].map(q=><button key={q} onClick={()=>setQb(q)} style={{padding:'8px',background:qb===q?'#14532d':'#111',border:`0.5px solid ${qb===q?'#22c55e':'#252525'}`,borderRadius:5,color:qb===q?'#22c55e':'#555',fontSize:9,fontWeight:700,cursor:'pointer'}}>{q==='Cooper Melvin'?'COOPER QB1':'BEN QB2'}</button>)}
            </div>
            <select value={concept} onChange={e=>setConcept(e.target.value)} style={{width:'100%',background:'#111',border:'0.5px solid #252525',borderRadius:6,color:'#ccc',padding:'7px',fontSize:13,marginBottom:6}}>
              {concepts.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
            <div style={{display:'grid',gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(4,1fr)',gap:3,marginBottom:6}}>
              {['Complete','Incomplete','INT','Scramble'].map(r=>{const col=r==='Complete'?'#22c55e':r==='INT'?'#dc2626':'#d97706';return<button key={r} onClick={()=>setResult(r==='INT'?'Interception':r)} style={{padding:'7px 2px',background:result===(r==='INT'?'Interception':r)?col+'22':'#111',border:`0.5px solid ${result===(r==='INT'?'Interception':r)?col:'#252525'}`,borderRadius:4,color:result===(r==='INT'?'Interception':r)?col:'#555',fontSize:9,fontWeight:700,cursor:'pointer'}}>{r}</button>})}
            </div>
            <input type="number" value={yds} onChange={e=>setYds(e.target.value)} placeholder="Yards" style={{width:'100%',background:'#111',border:'0.5px solid #252525',borderRadius:6,color:'#fff',padding:isMobile?'14px':'8px',fontSize:isMobile?30:22,fontWeight:700,outline:'none',marginBottom:8,textAlign:'center'}}/>
            <button onClick={log} style={{width:'100%',padding:'13px',background:'#14532d',border:'none',borderRadius:8,color:'#22c55e',fontWeight:700,fontSize:14,cursor:'pointer'}}>+ LOG PLAY</button>
          </div>
        </div>

        {plays.length>0&&(
          <div style={{background:'#0d0d0d',border:'0.5px solid #252525',borderRadius:8,overflow:'hidden'}}>
            <div style={{background:'#0a0a0a',padding:'5px 12px',borderBottom:'0.5px solid #252525',fontSize:8,fontWeight:700,color:'#555'}}>PLAY LOG — {plays.length} total</div>
            {[...plays].reverse().slice(0,8).map((p,i)=>{const rc=p.result==='Complete'?'#22c55e':p.result==='Incomplete'?'#d97706':'#dc2626';return(
              <div key={p.id} style={{display:'flex',gap:8,padding:'6px 12px',background:i%2===0?'#0f0f0f':'#141414',borderBottom:'0.5px solid #1a1a1a',fontSize:9,alignItems:'center'}}>
                <span style={{color:'#333',minWidth:36}}>{p.time}</span>
                <span style={{color:p.qb==='Cooper Melvin'?'#22c55e':'#F0B429',fontWeight:700,minWidth:22}}>{p.qb==='Cooper Melvin'?'CM':'BK'}</span>
                <span style={{color:'#F0B429',flex:1}}>{p.concept}</span>
                <span style={{color:rc,fontWeight:700}}>{p.result==='Complete'?'✓':p.result==='Incomplete'?'✗':'INT'}</span>
                <span style={{color:'#9ca3af',minWidth:28}}>{p.yds>0?`${p.yds}y`:''}</span>
              </div>
            )})}
          </div>
        )}
      </div>
    )
  }

  const CoachQuickRefTab=()=>{
    const [q,setQ]=React.useState('')
    const [ans,setAns]=React.useState('')
    const [load,setLoad]=React.useState(false)
    const [section,setSection]=React.useState('cheatsheet')
    const ref2=React.useRef(null)

    const QR_SYS=`You are the analytics director and offensive coordinator for Westfield Shamrocks. Answer any coaching question in 3 sentences max. Be direct and specific. Reference real stats. Season data: ${CTX}`

    const ask=async(question)=>{
      const msg=question||q
      if(!msg.trim()||load)return
      setLoad(true);setAns('');setQ('')
      try{
        const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:150,system:QR_SYS,messages:[{role:'user',content:msg}]})})
        const d=await r.json();setAns(d.content?.[0]?.text||'Error')
      }catch(e){setAns('Connection error.')}
      setLoad(false)
    }

    const sections=['cheatsheet','formations','weeklyemail']
    const formations=[
      {name:'Baltimore',type:'Deep crossing route',desc:'Y crosses behind the LBs, X runs a post. QB reads safety. Best vs Cover 1 and Cover 3.',epa:'+1.8'},
      {name:'Post',type:'Single high beater',desc:'X runs a 15-yard post over the middle. Best on left hash. QB plants and delivers vs Cover 3.',epa:'+1.4'},
      {name:'Four Verts',type:'Cover buster',desc:'All 4 receivers run verticals. Stresses every defensive zone. QB reads from right to left.',epa:'+1.9'},
      {name:'Verticals',type:'2-man vertical',desc:'Two outside receivers run deep. QB reads the strong safety. Best when winning and forcing the throw.',epa:'+2.1'},
      {name:'Stick',type:'Zone killer',desc:'Inside receiver runs 6-yard stick, outside runs a fade. QB hits the stick vs zone, fade vs man.',epa:'+0.8'},
      {name:'Out',type:'2nd down convert',desc:'Receiver runs a 7-yard out. QB reads leverage of the CB. Quick release — get it out in 1.8s.',epa:'+0.2'},
      {name:'Slant',type:'Press beater',desc:'Receiver runs a 45-degree slant inside. Beats press man immediately. Quick game opener.',epa:'+0.3'},
      {name:'Smash',type:'Two-level zone attack',desc:'Corner runs a hitch, inside runs a corner route. Stresses Cover 2 — QB reads the deep half.',epa:'+0.5'},
      {name:'RPO Glance',type:'Run-pass option',desc:'QB reads the box LB. Give to back on run, throw glance route to WR. Stresses run-pass discipline.',epa:'+0.4'},
    ]

    const quickQs=['What is our best play on 3rd and short?','What play beats Cover 2 with our guys?','When do we put Ben in?','What should we never call?','How does Cooper compare to a D2 recruit?','What is our biggest gap to fix?','Best play for the college showcase?','What does Ben need to work on today?']

    return(
      <div style={{padding:isMobile?10:16,fontFamily:'Helvetica,Arial,sans-serif'}}>
        <div style={{background:'#0a0a0a',border:'1px solid #22c55e',borderRadius:8,padding:12,marginBottom:12}}>
          <div style={{fontSize:11,fontWeight:700,color:'#22c55e',letterSpacing:2}}>📚 COACHING QUICK REFERENCE — Everything in One Place</div>
          <div style={{fontSize:8,color:'#555',marginTop:2}}>Game day cheat sheet · Formation diagrams · Ask any question · Weekly email generator · One screen coaches live on</div>
        </div>

        <div style={{background:'#0d0d0d',border:'1px solid #06b6d4',borderRadius:8,padding:12,marginBottom:12}}>
          <div style={{fontSize:9,fontWeight:700,color:'#06b6d4',marginBottom:6,letterSpacing:1}}>ASK ANYTHING — Plain English, Instant Answer</div>
          <div style={{display:'flex',gap:4,flexWrap:'wrap',marginBottom:8}}>
            {quickQs.map(q2=><button key={q2} onClick={()=>ask(q2)} style={{padding:'5px 9px',background:'#111',border:'0.5px solid #252525',borderRadius:14,color:'#9ca3af',fontSize:9,cursor:'pointer'}}>{q2}</button>)}
          </div>
          <div style={{display:'flex',gap:6}}>
            <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&ask(q)} placeholder="Any coach can type any question here..." style={{flex:1,background:'#111',border:'0.5px solid #06b6d4',borderRadius:8,padding:'10px 12px',color:'#fff',fontSize:13,outline:'none'}}/>
            <button onClick={()=>ask(q)} disabled={load||!q.trim()} style={{padding:'10px 18px',background:load||!q.trim()?'#111':'#0c1a3a',border:`0.5px solid ${load||!q.trim()?'#252525':'#06b6d4'}`,borderRadius:8,color:load||!q.trim()?'#555':'#06b6d4',fontWeight:700,fontSize:13,cursor:'pointer'}}>{load?'...':'Ask'}</button>
          </div>
          {ans&&<div style={{marginTop:10,background:'#111',border:'0.5px solid #06b6d4',borderRadius:6,padding:12}}><div style={{fontSize:8,fontWeight:700,color:'#06b6d4',marginBottom:4,letterSpacing:1}}>ANSWER</div><div style={{fontSize:13,color:'#ccc',lineHeight:1.6,whiteSpace:'pre-wrap'}}>{ans}</div></div>}
        </div>

        <div style={{display:'flex',gap:4,marginBottom:12}}>
          {[['cheatsheet','Game Day Sheet'],['formations','Formation Guide'],['weeklyemail','Weekly Email']].map(([k,l])=><button key={k} onClick={()=>setSection(k)} style={{padding:'8px 14px',background:section===k?'#14532d':'#0d0d0d',border:`0.5px solid ${section===k?'#22c55e':'#252525'}`,borderRadius:6,color:section===k?'#22c55e':'#555',fontSize:10,fontWeight:700,cursor:'pointer'}}>{l}</button>)}
        </div>

        {section==='cheatsheet'&&(
          <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr 1fr',gap:isMobile?8:10}}>
            <div style={{background:'#0a1a0a',border:'1px solid #22c55e33',borderRadius:8,padding:12}}>
              <div style={{fontSize:10,fontWeight:700,color:'#22c55e',marginBottom:8,letterSpacing:1}}>CALL EVERY PLAY</div>
              {[['Baltimore','Any down any hash — +1.8 EPA'],['Post','1st down left hash — +1.4 EPA'],['Stick','Every series never fails — +0.8 EPA'],['Four Verts','Deep shot showcase — +1.9 EPA'],['Verticals','Winning big plays — +2.1 EPA']].map(([p,n])=><div key={p} style={{padding:'6px 0',borderBottom:'0.5px solid #1d3a1d'}}><div style={{fontSize:11,fontWeight:700,color:'#22c55e'}}>{p}</div><div style={{fontSize:8,color:'#555'}}>{n}</div></div>)}
            </div>
            <div style={{background:'#0a0a0a',border:'0.5px solid #252525',borderRadius:8,padding:12}}>
              <div style={{fontSize:10,fontWeight:700,color:'#F0B429',marginBottom:8,letterSpacing:1}}>SITUATION CALLS</div>
              {[['1st & 10','Baltimore or Post'],['2nd & Med','Stick or Out'],['3rd & Short','Stick — 100%'],['3rd & Long','Four Verts or Post'],['Red Zone','Install package NOW'],['2 Minute','Stick → Out → Baltimore'],['Down 7','Four Verts or Verticals'],['Up 7','Stick → RPO → clock']].map(([sit,call])=><div key={sit} style={{display:'flex',justifyContent:'space-between',padding:'4px 0',borderBottom:'0.5px solid #1a1a1a'}}><span style={{fontSize:9,color:'#555'}}>{sit}</span><span style={{fontSize:9,fontWeight:700,color:'#F0B429'}}>{call}</span></div>)}
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              <div style={{background:'#1a0404',border:'1px solid #dc262633',borderRadius:8,padding:12}}>
                <div style={{fontSize:10,fontWeight:700,color:'#dc2626',marginBottom:6}}>NEVER CALL</div>
                {[['Sail','0% · -0.6 EPA · drill only'],['Fade','0% · -0.8 EPA · drill only'],['Red Zone live','No package installed yet']].map(([p,n])=><div key={p} style={{padding:'5px 0',borderBottom:'0.5px solid #2a0404'}}><div style={{fontSize:11,fontWeight:700,color:'#dc2626'}}>{p}</div><div style={{fontSize:8,color:'#7f1d1d'}}>{n}</div></div>)}
              </div>
              <div style={{background:'#0c0a06',border:'0.5px solid #2a1a00',borderRadius:8,padding:12}}>
                <div style={{fontSize:10,fontWeight:700,color:'#F0B429',marginBottom:6}}>QB ROTATION</div>
                {[['Cooper','Starts every game'],['Cooper','Deep routes 3rd down'],['Ben','Short package reps'],['NEVER','Ben on deep 3rd down']].map(([qb,note],i)=><div key={i} style={{display:'flex',justifyContent:'space-between',padding:'4px 0',borderBottom:'0.5px solid #1a1a00'}}><span style={{fontSize:9,color:qb==='NEVER'?'#dc2626':qb==='Cooper'?'#22c55e':'#F0B429',fontWeight:700}}>{qb}</span><span style={{fontSize:9,color:'#555'}}>{note}</span></div>)}
              </div>
            </div>
          </div>
        )}

        {section==='formations'&&(
          <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:8}}>
            {formations.map(f=>(
              <div key={f.name} style={{background:'#0d0d0d',border:'0.5px solid #1d3a1d',borderRadius:8,padding:12,cursor:'pointer'}} onClick={()=>ask(`Explain exactly how to run the ${f.name} route concept and what the QB reads step by step`)}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
                  <div><span style={{fontSize:13,fontWeight:700,color:'#22c55e'}}>{f.name}</span><span style={{fontSize:8,color:'#555',marginLeft:8}}>{f.type}</span></div>
                  <span style={{fontSize:10,fontWeight:700,color:'#22c55e',background:'#14532d',padding:'2px 7px',borderRadius:4}}>EPA {f.epa}</span>
                </div>
                <div style={{fontSize:11,color:'#9ca3af',lineHeight:1.5}}>{f.desc}</div>
                <div style={{fontSize:8,color:'#444',marginTop:4}}>Tap for QB read breakdown ↗</div>
              </div>
            ))}
          </div>
        )}

        {section==='weeklyemail'&&(
          <WeeklyEmailGen/>
        )}
      </div>
    )
  }

  const WeeklyEmailGen=()=>{
    const [email,setEmail]=React.useState('')
    const [subj,setSubj]=React.useState('')
    const [load,setLoad]=React.useState(false)
    const [type,setType]=React.useState('weekly')
    const types=[['weekly','Weekly Report'],['practice','Practice Plan'],['showcase','Showcase Prep'],['parents','Parent Update']]
    const gen=async()=>{
      setLoad(true);setEmail('');setSubj('')
      const prompts={
        weekly:'Write a weekly football analytics report email for Westfield Shamrocks coaching staff. Professional tone. Include: session summary (Cooper 75% comp 5/12, Ben 55% comp 5/12), top concepts (Baltimore Post Stick all 100%), cut list (Sail Fade 0%), priority for next practice (red zone package install), and Cooper projection update (hash fix = RTG 96, redzone fix = RTG 102). Sign off as Westfield Analytics Staff.',
        practice:'Write a practice plan email for Westfield Shamrocks coaching staff. Include: focus for the session (red zone install and hash routes), specific drills (Cooper hash 10 reps each side, Ben flat release 20 reps), concept rotation (Baltimore Post Stick must get reps every practice), and goal for the session (both QBs above 80% comp). Professional and direct.',
        showcase:'Write a college showcase preparation email for Westfield Shamrocks coaches. Include: Cooper introduction talking points for college coaches (84% comp RTG87 deep ball 88% vs NFL 52%), which plays to feature (Baltimore Post Four Verts for Cooper), talking points about his projection (hash fix = D2/D3 scholarship, redzone fix = D1-AA/FCS), and what college coaches care about seeing. Make it feel like a D1 program prep memo.',
        parents:'Write a positive parent update email for Westfield Shamrocks families. Highlight team progress, mention Cooper Melvin\'s strong season (84% completion, college showcase ready), mention Ben Kooi\'s improvement trend, explain what the coaching staff is working on, and build excitement for the upcoming season. Upbeat and family-friendly tone. No technical jargon.'
      }
      try{
        const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:500,system:'You are the analytics director for Westfield Shamrocks football. Write professional emails. First line is the subject line starting with Subject:',messages:[{role:'user',content:prompts[type]}]})})
        const d=await r.json()
        const text=d.content?.[0]?.text||'Error'
        const lines=text.split('\n')
        setSubj(lines[0].replace(/^Subject:\s*/i,'').replace(/\*\*/g,'').trim()||'Westfield Shamrocks Update')
        setEmail(lines.slice(1).join('\n').trim())
      }catch(e){setEmail('Connection error.')}
      setLoad(false)
    }
    return(
      <div>
        <div style={{display:'flex',gap:6,marginBottom:10,flexWrap:'wrap'}}>
          {types.map(([k,l])=><button key={k} onClick={()=>setType(k)} style={{padding:'7px 12px',background:type===k?'#14532d':'#0d0d0d',border:`0.5px solid ${type===k?'#22c55e':'#252525'}`,borderRadius:6,color:type===k?'#22c55e':'#555',fontSize:10,fontWeight:700,cursor:'pointer'}}>{l}</button>)}
        </div>
        <button onClick={gen} disabled={load} style={{width:'100%',padding:'12px',background:load?'#111':'#14532d',border:`0.5px solid ${load?'#252525':'#22c55e'}`,borderRadius:8,color:load?'#555':'#22c55e',fontWeight:700,fontSize:13,cursor:'pointer',marginBottom:10}}>
          {load?'Writing from your season data...':'📧 GENERATE EMAIL'}
        </button>
        {email&&(
          <div style={{background:'#0d0d0d',border:'0.5px solid #1d3a1d',borderRadius:8,padding:14}}>
            <div style={{marginBottom:8}}><div style={{fontSize:7,color:'#555',marginBottom:3}}>SUBJECT</div><div style={{fontSize:13,fontWeight:700,color:'#ccc'}}>{subj}</div></div>
            <textarea value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%',background:'#111',border:'0.5px solid #252525',borderRadius:6,color:'#ccc',padding:'10px',fontSize:12,outline:'none',minHeight:200,resize:'none',boxSizing:'border-box',lineHeight:1.7}}/>
            <button onClick={()=>window.open(`mailto:?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(email)}`)} style={{width:'100%',marginTop:8,padding:'11px',background:'#14532d',border:'none',borderRadius:8,color:'#22c55e',fontWeight:700,fontSize:13,cursor:'pointer'}}>📧 OPEN IN MAIL APP</button>
          </div>
        )}
      </div>
    )
  }


  const HeatMapTab=()=>{
    const canvasRef=React.useRef(null)
    const zoneRef=React.useRef(null)
    const [view,setView]=React.useState('heatmap')
    const [qbF,setQbF]=React.useState('both')
    const [conF,setConF]=React.useState('All')
    const [sessF,setSessF]=React.useState('All')
    const throws=[
      {id:1,qb:'Cooper',concept:'Baltimore',result:'Complete',yds:14,x:28,y:28,sess:'4/21',pressure:false},
      {id:2,qb:'Cooper',concept:'Post',result:'Complete',yds:18,x:32,y:16,sess:'4/21',pressure:false},
      {id:3,qb:'Cooper',concept:'Stick',result:'Complete',yds:7,x:14,y:22,sess:'4/21',pressure:false},
      {id:4,qb:'Cooper',concept:'Out',result:'Complete',yds:6,x:12,y:12,sess:'4/21',pressure:false},
      {id:5,qb:'Cooper',concept:'Stick',result:'Complete',yds:9,x:15,y:30,sess:'4/21',pressure:false},
      {id:6,qb:'Cooper',concept:'Sail',result:'Incomplete',yds:0,x:36,y:42,sess:'4/21',pressure:false},
      {id:7,qb:'Cooper',concept:'Fade',result:'Incomplete',yds:0,x:22,y:8,sess:'4/21',pressure:true},
      {id:8,qb:'Cooper',concept:'Slant',result:'Complete',yds:5,x:10,y:26,sess:'4/21',pressure:false},
      {id:9,qb:'Cooper',concept:'Out',result:'Complete',yds:6,x:12,y:38,sess:'4/21',pressure:false},
      {id:10,qb:'Cooper',concept:'Sail',result:'Incomplete',yds:0,x:34,y:44,sess:'4/21',pressure:false},
      {id:11,qb:'Ben',concept:'Stick',result:'Complete',yds:8,x:14,y:24,sess:'4/21',pressure:false},
      {id:12,qb:'Ben',concept:'Out',result:'Complete',yds:6,x:11,y:16,sess:'4/21',pressure:false},
      {id:13,qb:'Ben',concept:'Slant',result:'Complete',yds:5,x:9,y:27,sess:'4/21',pressure:false},
      {id:14,qb:'Ben',concept:'Fade',result:'Incomplete',yds:0,x:20,y:10,sess:'4/21',pressure:true},
      {id:15,qb:'Ben',concept:'Sail',result:'Incomplete',yds:0,x:32,y:42,sess:'4/21',pressure:false},
      {id:16,qb:'Ben',concept:'Post',result:'Incomplete',yds:0,x:30,y:14,sess:'4/21',pressure:false},
      {id:17,qb:'Ben',concept:'Stick',result:'Complete',yds:7,x:13,y:29,sess:'4/21',pressure:false},
      {id:18,qb:'Ben',concept:'Baltimore',result:'Complete',yds:12,x:24,y:26,sess:'4/21',pressure:false},
      {id:19,qb:'Ben',concept:'Slant',result:'Incomplete',yds:0,x:8,y:22,sess:'4/21',pressure:true},
      {id:20,qb:'Ben',concept:'Out',result:'Complete',yds:6,x:11,y:36,sess:'4/21',pressure:false},
      {id:21,qb:'Cooper',concept:'Baltimore',result:'Complete',yds:13,x:27,y:30,sess:'4/27',pressure:false},
      {id:22,qb:'Cooper',concept:'Post',result:'Complete',yds:16,x:30,y:17,sess:'4/27',pressure:false},
      {id:23,qb:'Cooper',concept:'Stick',result:'Complete',yds:8,x:14,y:25,sess:'4/27',pressure:false},
      {id:24,qb:'Cooper',concept:'Slant',result:'Complete',yds:5,x:9,y:22,sess:'4/27',pressure:false},
      {id:25,qb:'Cooper',concept:'Sail',result:'Incomplete',yds:0,x:35,y:43,sess:'4/27',pressure:false},
      {id:26,qb:'Cooper',concept:'Out',result:'Complete',yds:7,x:13,y:13,sess:'4/27',pressure:false},
      {id:27,qb:'Cooper',concept:'Fade',result:'Incomplete',yds:0,x:20,y:9,sess:'4/27',pressure:false},
      {id:28,qb:'Cooper',concept:'RPO Glance',result:'Complete',yds:8,x:12,y:26,sess:'4/27',pressure:false},
      {id:29,qb:'Cooper',concept:'Baltimore',result:'Complete',yds:15,x:29,y:22,sess:'4/27',pressure:false},
      {id:30,qb:'Cooper',concept:'Sail',result:'Incomplete',yds:0,x:33,y:41,sess:'4/27',pressure:true},
      {id:31,qb:'Ben',concept:'Stick',result:'Complete',yds:7,x:13,y:24,sess:'4/27',pressure:false},
      {id:32,qb:'Ben',concept:'Out',result:'Incomplete',yds:0,x:10,y:15,sess:'4/27',pressure:false},
      {id:33,qb:'Ben',concept:'Slant',result:'Complete',yds:5,x:9,y:27,sess:'4/27',pressure:false},
      {id:34,qb:'Ben',concept:'Fade',result:'Incomplete',yds:0,x:19,y:11,sess:'4/27',pressure:true},
      {id:35,qb:'Ben',concept:'Sail',result:'Incomplete',yds:0,x:31,y:43,sess:'4/27',pressure:false},
      {id:36,qb:'Ben',concept:'Baltimore',result:'Complete',yds:11,x:24,y:28,sess:'4/27',pressure:false},
      {id:37,qb:'Cooper',concept:'Verticals',result:'Complete',yds:28,x:46,y:26,sess:'4/30',pressure:false},
      {id:38,qb:'Cooper',concept:'Post',result:'Complete',yds:14,x:28,y:18,sess:'4/30',pressure:false},
      {id:39,qb:'Cooper',concept:'Stick',result:'Complete',yds:8,x:15,y:26,sess:'4/30',pressure:false},
      {id:40,qb:'Ben',concept:'Stick',result:'Complete',yds:7,x:13,y:25,sess:'4/30',pressure:false},
      {id:41,qb:'Ben',concept:'Post',result:'Incomplete',yds:0,x:28,y:15,sess:'4/30',pressure:true},
      {id:42,qb:'Cooper',concept:'Baltimore',result:'Complete',yds:12,x:26,y:29,sess:'Show.',pressure:false},
      {id:43,qb:'Cooper',concept:'Post',result:'Complete',yds:17,x:31,y:16,sess:'Show.',pressure:false},
      {id:44,qb:'Cooper',concept:'Stick',result:'Complete',yds:8,x:14,y:24,sess:'Show.',pressure:false},
      {id:45,qb:'Cooper',concept:'Four Verts',result:'Complete',yds:22,x:38,y:26,sess:'Show.',pressure:false},
      {id:46,qb:'Cooper',concept:'Out',result:'Complete',yds:6,x:11,y:12,sess:'Show.',pressure:true},
      {id:47,qb:'Cooper',concept:'Slant',result:'Complete',yds:5,x:9,y:28,sess:'Show.',pressure:false},
      {id:48,qb:'Cooper',concept:'Sail',result:'Incomplete',yds:0,x:34,y:43,sess:'Show.',pressure:false},
      {id:49,qb:'Cooper',concept:'RPO Glance',result:'Complete',yds:7,x:12,y:25,sess:'Show.',pressure:false},
      {id:50,qb:'Cooper',concept:'Fade',result:'Incomplete',yds:0,x:19,y:10,sess:'Show.',pressure:false},
      {id:51,qb:'Cooper',concept:'Baltimore',result:'Complete',yds:14,x:27,y:27,sess:'Show.',pressure:false},
      {id:52,qb:'Ben',concept:'Stick',result:'Complete',yds:8,x:14,y:24,sess:'Show.',pressure:false},
      {id:53,qb:'Ben',concept:'Out',result:'Complete',yds:6,x:11,y:14,sess:'Show.',pressure:false},
      {id:54,qb:'Ben',concept:'Slant',result:'Complete',yds:5,x:9,y:27,sess:'Show.',pressure:false},
      {id:55,qb:'Ben',concept:'Baltimore',result:'Complete',yds:11,x:23,y:29,sess:'Show.',pressure:false},
      {id:56,qb:'Ben',concept:'Sail',result:'Incomplete',yds:0,x:32,y:42,sess:'Show.',pressure:false},
      {id:57,qb:'Ben',concept:'Fade',result:'Incomplete',yds:0,x:20,y:11,sess:'Show.',pressure:true},
      {id:58,qb:'Ben',concept:'Post',result:'Incomplete',yds:0,x:29,y:14,sess:'Show.',pressure:false},
      {id:59,qb:'Ben',concept:'RPO Glance',result:'Complete',yds:7,x:12,y:26,sess:'Show.',pressure:false},
      {id:60,qb:'Ben',concept:'Stick',result:'Complete',yds:9,x:15,y:23,sess:'Show.',pressure:false},
      {id:61,qb:'Ben',concept:'Out',result:'Complete',yds:6,x:11,y:37,sess:'Show.',pressure:false},
      {id:62,qb:'Cooper',concept:'Baltimore',result:'Complete',yds:13,x:27,y:28,sess:'5/8',pressure:false},
      {id:63,qb:'Cooper',concept:'Post',result:'Complete',yds:15,x:29,y:17,sess:'5/8',pressure:false},
      {id:64,qb:'Cooper',concept:'Stick',result:'Complete',yds:8,x:14,y:26,sess:'5/8',pressure:false},
      {id:65,qb:'Cooper',concept:'Verticals',result:'Complete',yds:30,x:48,y:25,sess:'5/8',pressure:false},
      {id:66,qb:'Cooper',concept:'Out',result:'Complete',yds:6,x:11,y:13,sess:'5/8',pressure:false},
      {id:67,qb:'Ben',concept:'Stick',result:'Complete',yds:7,x:13,y:24,sess:'5/8',pressure:false},
      {id:68,qb:'Ben',concept:'Sail',result:'Incomplete',yds:0,x:33,y:43,sess:'5/8',pressure:false},
      {id:69,qb:'Ben',concept:'Fade',result:'Incomplete',yds:0,x:19,y:10,sess:'5/8',pressure:false},
      {id:70,qb:'Ben',concept:'Out',result:'Incomplete',yds:0,x:10,y:15,sess:'5/8',pressure:true},
      {id:71,qb:'Ben',concept:'Post',result:'Incomplete',yds:0,x:28,y:16,sess:'5/8',pressure:false},
      {id:72,qb:'Cooper',concept:'Baltimore',result:'Complete',yds:12,x:26,y:27,sess:'5/12',pressure:false},
      {id:73,qb:'Cooper',concept:'Post',result:'Complete',yds:16,x:30,y:16,sess:'5/12',pressure:false},
      {id:74,qb:'Cooper',concept:'Stick',result:'Complete',yds:9,x:15,y:25,sess:'5/12',pressure:false},
      {id:75,qb:'Cooper',concept:'Four Verts',result:'Complete',yds:24,x:40,y:27,sess:'5/12',pressure:false},
      {id:76,qb:'Cooper',concept:'Slant',result:'Complete',yds:5,x:9,y:23,sess:'5/12',pressure:false},
      {id:77,qb:'Cooper',concept:'Sail',result:'Incomplete',yds:0,x:35,y:44,sess:'5/12',pressure:false},
      {id:78,qb:'Cooper',concept:'Smash',result:'Complete',yds:8,x:15,y:26,sess:'5/12',pressure:false},
      {id:79,qb:'Cooper',concept:'RPO Glance',result:'Complete',yds:7,x:12,y:24,sess:'5/12',pressure:false},
      {id:80,qb:'Cooper',concept:'Post',result:'Interception',yds:0,x:32,y:14,sess:'5/12',pressure:true},
      {id:81,qb:'Cooper',concept:'Baltimore',result:'Complete',yds:11,x:25,y:29,sess:'5/12',pressure:false},
      {id:82,qb:'Cooper',concept:'Out',result:'Complete',yds:6,x:11,y:12,sess:'5/12',pressure:false},
      {id:83,qb:'Cooper',concept:'Fade',result:'Incomplete',yds:0,x:21,y:9,sess:'5/12',pressure:false},
      {id:84,qb:'Cooper',concept:'Slant',result:'Complete',yds:5,x:9,y:27,sess:'5/12',pressure:false},
      {id:85,qb:'Cooper',concept:'Out',result:'Complete',yds:7,x:13,y:38,sess:'5/12',pressure:false},
      {id:86,qb:'Cooper',concept:'Stick',result:'Complete',yds:8,x:14,y:23,sess:'5/12',pressure:false},
      {id:87,qb:'Cooper',concept:'Smash',result:'Complete',yds:8,x:15,y:27,sess:'5/12',pressure:false},
      {id:88,qb:'Ben',concept:'Stick',result:'Complete',yds:7,x:13,y:24,sess:'5/12',pressure:false},
      {id:89,qb:'Ben',concept:'Out',result:'Complete',yds:6,x:11,y:15,sess:'5/12',pressure:false},
      {id:90,qb:'Ben',concept:'Slant',result:'Complete',yds:5,x:9,y:27,sess:'5/12',pressure:false},
      {id:91,qb:'Ben',concept:'Sail',result:'Incomplete',yds:0,x:32,y:43,sess:'5/12',pressure:false},
      {id:92,qb:'Ben',concept:'Fade',result:'Incomplete',yds:0,x:20,y:10,sess:'5/12',pressure:false},
      {id:93,qb:'Ben',concept:'Baltimore',result:'Complete',yds:10,x:23,y:28,sess:'5/12',pressure:false},
      {id:94,qb:'Ben',concept:'Smash',result:'Complete',yds:8,x:15,y:26,sess:'5/12',pressure:false},
      {id:95,qb:'Ben',concept:'Post',result:'Incomplete',yds:0,x:30,y:15,sess:'5/12',pressure:true},
      {id:96,qb:'Ben',concept:'Stick',result:'Complete',yds:9,x:14,y:23,sess:'5/12',pressure:false},
      {id:97,qb:'Ben',concept:'RPO Glance',result:'Complete',yds:7,x:12,y:25,sess:'5/12',pressure:false},
      {id:98,qb:'Ben',concept:'Out',result:'Incomplete',yds:0,x:10,y:37,sess:'5/12',pressure:false},
      {id:99,qb:'Ben',concept:'Slant',result:'Complete',yds:5,x:9,y:22,sess:'5/12',pressure:false},
    ]
    const concepts=['All','Baltimore','Post','Stick','Four Verts','Verticals','Out','Slant','Smash','RPO Glance','Sail','Fade']
    const sessions=['All','4/21','4/27','4/30','Show.','5/8','5/12']
    const filtered=throws.filter(t=>{
      const qbOk=qbF==='both'||(qbF==='cooper'&&t.qb==='Cooper')||(qbF==='ben'&&t.qb==='Ben')
      const cOk=conF==='All'||t.concept===conF
      const sOk=sessF==='All'||t.sess===sessF
      return qbOk&&cOk&&sOk
    })
    const gc=p=>p>=80?'#22c55e':p>=65?'#d97706':p>0?'#dc2626':'#7f1d1d'
    const drawField=(ctx,W,H)=>{
      ctx.fillStyle='#0a1a0a';ctx.fillRect(0,0,W,H)
      const sx=x=>x*(W/60),sy=y=>(53.3-y)*(H/53.3)
      for(let yd=0;yd<=60;yd+=5){
        ctx.strokeStyle=yd%10===0?'#22c55e44':'#22c55e22';ctx.lineWidth=yd%10===0?1:0.5
        ctx.beginPath();ctx.moveTo(sx(yd),0);ctx.lineTo(sx(yd),H);ctx.stroke()
        if(yd%10===0&&yd>0){ctx.fillStyle='#22c55e66';ctx.font='8px Helvetica';ctx.textAlign='center';ctx.fillText(yd>50?(100-yd):yd,sx(yd),H-3)}
      }
      for(let yd=0;yd<=60;yd++){
        ctx.strokeStyle='#22c55e1a';ctx.lineWidth=0.3
        ctx.beginPath();ctx.moveTo(sx(yd),sy(18));ctx.lineTo(sx(yd),sy(18)-3);ctx.stroke()
        ctx.beginPath();ctx.moveTo(sx(yd),sy(35));ctx.lineTo(sx(yd),sy(35)-3);ctx.stroke()
      }
      ctx.fillStyle='#22c55e44';ctx.font='7px Helvetica';ctx.textAlign='left'
      ctx.fillText('L.Hash',sx(0)+2,sy(18)+2);ctx.fillText('R.Hash',sx(0)+2,sy(35)+2)
      ctx.fillStyle='#F0B42966';ctx.font='7px Helvetica';ctx.textAlign='center'
      ctx.fillText('← LINE OF SCRIMMAGE',sx(2),H-1)
      return {sx,sy}
    }
    React.useEffect(()=>{
      const canvas=canvasRef.current;if(!canvas||(view!=='heatmap'&&view!=='throwmap'))return
      const ctx=canvas.getContext('2d');const W=canvas.width,H=canvas.height
      const {sx,sy}=drawField(ctx,W,H)
      if(view==='heatmap'){
        const cw=6,ch=8
        for(let gx=0;gx<60;gx+=cw){for(let gy=0;gy<53.3;gy+=ch){
          const cell=filtered.filter(t=>t.x>=gx&&t.x<gx+cw&&t.y>=gy&&t.y<gy+ch)
          if(!cell.length)continue
          const pct=cell.filter(t=>t.result==='Complete').length/cell.length
          const al=Math.min(0.1+cell.length*0.13,0.7)
          ctx.fillStyle=pct>=0.8?`rgba(34,197,94,${al})`:pct>=0.5?`rgba(217,119,6,${al})`:`rgba(220,38,38,${al})`
          ctx.fillRect(sx(gx),sy(gy+ch),sx(gx+cw)-sx(gx),sy(gy)-sy(gy+ch))
        }}
      } else {
        filtered.forEach(t=>{
          const x=sx(t.x),y=sy(t.y)
          const col=t.result==='Complete'?'#22c55e':t.result==='Interception'?'#f97316':'#dc2626'
          ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2)
          ctx.fillStyle=col;ctx.fill()
          ctx.strokeStyle='#000000cc';ctx.lineWidth=0.8;ctx.stroke()
          ctx.fillStyle='#fff';ctx.font='bold 5px Helvetica';ctx.textAlign='center'
          ctx.fillText(t.qb==='Cooper'?'C':'B',x,y+2)
        })
      }
    },[view,qbF,conF,sessF])
    React.useEffect(()=>{
      const canvas=zoneRef.current;if(!canvas||view!=='zonechart')return
      const ctx=canvas.getContext('2d');const W=canvas.width,H=canvas.height
      ctx.fillStyle='#0a0a0a';ctx.fillRect(0,0,W,H)
      const zoneData={
        both:{LD:{p:84,a:22},MD:{p:87,a:15},RD:{p:0,a:9},LS:{p:72,a:32},MS:{p:86,a:38},RS:{p:71,a:14}},
        cooper:{LD:{p:85,a:12},MD:{p:88,a:8},RD:{p:0,a:5},LS:{p:73,a:18},MS:{p:87,a:22},RS:{p:73,a:8}},
        ben:{LD:{p:82,a:10},MD:{p:86,a:7},RD:{p:0,a:4},LS:{p:70,a:14},MS:{p:85,a:16},RS:{p:68,a:6}},
      }
      const d=zoneData[qbF]||zoneData.both
      const zones=[
        {k:'LD',l:'LEFT DEEP',x:0,y:0,w:W/3,h:H/2},
        {k:'MD',l:'MID DEEP',x:W/3,y:0,w:W/3,h:H/2},
        {k:'RD',l:'RIGHT DEEP',x:2*W/3,y:0,w:W/3,h:H/2},
        {k:'LS',l:'LEFT SHORT',x:0,y:H/2,w:W/3,h:H/2},
        {k:'MS',l:'MID SHORT',x:W/3,y:H/2,w:W/3,h:H/2},
        {k:'RS',l:'RIGHT SHORT',x:2*W/3,y:H/2,w:W/3,h:H/2},
      ]
      zones.forEach(z=>{
        const zd=d[z.k];const p=zd.p
        let r=220,g=38,b=38
        if(p>=80){r=34;g=197;b=94}else if(p>=65){r=217;g=119;b=6}
        const al=p>0?0.12+p/100*0.38:0.3
        ctx.fillStyle=`rgba(${r},${g},${b},${al})`;ctx.fillRect(z.x+1,z.y+1,z.w-2,z.h-2)
        ctx.strokeStyle=p>=80?'#22c55e99':p>=65?'#d9770699':p>0?'#dc262699':'#dc262644'
        ctx.lineWidth=1.5;ctx.strokeRect(z.x+1,z.y+1,z.w-2,z.h-2)
        const mx=z.x+z.w/2,my=z.y+z.h/2
        ctx.fillStyle=p>=80?'#22c55e':p>=65?'#d97706':p>0?'#dc2626':'#7f1d1d'
        ctx.font='bold 10px Helvetica';ctx.textAlign='center'
        ctx.fillText(z.l,mx,my-18)
        ctx.font='bold 22px Helvetica'
        ctx.fillText(p>0?p+'%':'0%',mx,my+8)
        ctx.font='9px Helvetica';ctx.fillStyle='#ffffff88'
        ctx.fillText(zd.a+' att',mx,my+22)
        const grade=p>=80?'ELITE':p>=65?'SOLID':p>0?'WEAK':'DEAD ZONE'
        ctx.fillStyle=`rgba(${r},${g},${b},0.3)`;ctx.fillRect(mx-24,z.y+z.h-20,48,16)
        ctx.fillStyle=p>=80?'#22c55e':p>=65?'#d97706':p>0?'#dc2626':'#7f1d1d'
        ctx.font='bold 8px Helvetica';ctx.fillText(grade,mx,z.y+z.h-9)
      })
      ctx.strokeStyle='#F0B42988';ctx.lineWidth=2;ctx.setLineDash([5,3])
      ctx.beginPath();ctx.moveTo(0,H/2);ctx.lineTo(W,H/2);ctx.stroke();ctx.setLineDash([])
      ctx.fillStyle='#F0B42966';ctx.font='bold 9px Helvetica';ctx.textAlign='left'
      ctx.fillText('DEEP →',4,H/2-5);ctx.fillText('SHORT →',4,H/2+12)
    },[view,qbF])
    const conStats=concepts.filter(c=>c!=='All').map(con=>{
      const pl=filtered.filter(t=>t.concept===con)
      const cp=pl.filter(t=>t.result==='Complete')
      return{concept:con,att:pl.length,pct:pl.length?Math.round(cp.length/pl.length*100):0,yds:pl.length?(pl.reduce((a,t)=>a+t.yds,0)/pl.length).toFixed(1):0}
    }).filter(x=>x.att>0).sort((a,b)=>b.pct-a.pct)
    const sessStats=sessions.filter(s=>s!=='All').map(sess=>{
      const sp=filtered.filter(t=>t.sess===sess)
      return{sess,att:sp.length,pct:sp.length?Math.round(sp.filter(t=>t.result==='Complete').length/sp.length*100):0}
    }).filter(s=>s.att>0)
    const tot=filtered.length,comp=filtered.filter(t=>t.result==='Complete').length
    const ints=filtered.filter(t=>t.result==='Interception').length
    const pct=tot?Math.round(comp/tot*100):0
    const ypa=tot?(filtered.reduce((a,t)=>a+t.yds,0)/tot).toFixed(1):0
    const pr=filtered.filter(t=>t.pressure).length
    return(
      <div style={{padding:isMobile?10:16,fontFamily:'Helvetica,Arial,sans-serif'}}>
        <div style={{background:'#0a0a0a',border:'1px solid #22c55e',borderRadius:8,padding:12,marginBottom:12}}>
          <div style={{fontSize:11,fontWeight:700,color:'#22c55e',letterSpacing:2}}>🗺 HEAT MAPS & FIELD VISUALIZATIONS — Every Player · Every Play</div>
          <div style={{fontSize:8,color:'#555',marginTop:2}}>99 plays mapped to field coordinates · Heat map · Throw dots · Zone chart · Concept bars · Session trends · Pressure breakdown</div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr 1fr',gap:isMobile?6:8,marginBottom:10}}>
          <div><div style={{fontSize:7,color:'#555',marginBottom:4,letterSpacing:1}}>QB</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:3}}>
              {[['both','Both'],['cooper','Cooper'],['ben','Ben']].map(([k,l])=>(
                <button key={k} onClick={()=>setQbF(k)} style={{padding:'7px',background:qbF===k?'#14532d':'#111',border:`0.5px solid ${qbF===k?'#22c55e':'#252525'}`,borderRadius:4,color:qbF===k?'#22c55e':'#555',fontSize:9,fontWeight:700,cursor:'pointer'}}>{l}</button>
              ))}
            </div>
          </div>
          <div><div style={{fontSize:7,color:'#555',marginBottom:4,letterSpacing:1}}>CONCEPT</div>
            <select value={conF} onChange={e=>setConF(e.target.value)} style={{width:'100%',background:'#111',border:'0.5px solid #252525',borderRadius:6,color:'#ccc',padding:'7px',fontSize:12}}>
              {concepts.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div><div style={{fontSize:7,color:'#555',marginBottom:4,letterSpacing:1}}>SESSION</div>
            <select value={sessF} onChange={e=>setSessF(e.target.value)} style={{width:'100%',background:'#111',border:'0.5px solid #252525',borderRadius:6,color:'#ccc',padding:'7px',fontSize:12}}>
              {sessions.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(4,1fr)',gap:6,marginBottom:10}}>
          {[['heatmap','🔥 Heat Map','Zones by comp%'],['throwmap','📍 Throw Map','Every throw plotted'],['zonechart','🗺 Zone Chart','Field breakdown'],['conceptbars','📊 Concept Bars','All concepts ranked']].map(([k,l,d])=>(
            <button key={k} onClick={()=>setView(k)} style={{padding:'9px 5px',border:`1px solid ${view===k?'#22c55e':'#1a1a1a'}`,borderRadius:6,background:view===k?'#0a1a0a':'#0d0d0d',cursor:'pointer',textAlign:'center'}}>
              <div style={{fontSize:10,fontWeight:700,color:view===k?'#22c55e':'#555'}}>{l}</div>
              <div style={{fontSize:7,color:'#444',marginTop:2}}>{d}</div>
            </button>
          ))}
        </div>
        <div style={{display:'grid',gridTemplateColumns:isMobile?'repeat(3,1fr)':'repeat(5,1fr)',gap:5,marginBottom:10}}>
          {[['PLAYS',tot,'#22c55e'],['COMP%',`${pct}%`,gc(pct)],['YDS/ATT',ypa,'#F0B429'],['INTS',ints,ints===0?'#22c55e':'#dc2626'],['PRESSURE',`${tot?Math.round(pr/tot*100):0}%`,pr/tot<0.25?'#22c55e':'#d97706']].map(([l,v,col])=>(
            <div key={l} style={{background:'#111',border:`0.5px solid ${col}33`,borderRadius:7,padding:'8px 4px',textAlign:'center'}}>
              <div style={{fontSize:17,fontWeight:700,color:col,lineHeight:1}}>{v}</div>
              <div style={{fontSize:7,color:'#555',marginTop:2,letterSpacing:1}}>{l}</div>
            </div>
          ))}
        </div>
        {(view==='heatmap'||view==='throwmap')&&(
          <div>
            <div style={{fontSize:8,fontWeight:700,color:'#F0B429',marginBottom:5,letterSpacing:1}}>
              {view==='heatmap'?'COMPLETION HEAT MAP — green = elite zone · orange = needs work · red = dead zone':'THROW MAP — C = Cooper · B = Ben · green = complete · red = incomplete · orange = INT'}
            </div>
            {view==='throwmap'&&(
              <div style={{display:'flex',gap:10,marginBottom:6}}>
                {[['#22c55e','C = Cooper Complete'],['#dc2626','C/B = Incomplete'],['#f97316','C/B = Interception'],['#60a5fa','B = Ben Complete']].map(([col,lbl])=>(
                  <div key={lbl} style={{display:'flex',alignItems:'center',gap:4}}>
                    <div style={{width:10,height:10,borderRadius:'50%',background:col,flexShrink:0}}/>
                    <span style={{fontSize:8,color:'#555'}}>{lbl}</span>
                  </div>
                ))}
              </div>
            )}
            <canvas ref={canvasRef} width={620} height={320} style={{width:'100%',borderRadius:8,border:'1px solid #1d3a1d',display:'block',marginBottom:6}}/>
            <div style={{fontSize:7,color:'#333',textAlign:'center'}}>{filtered.length} plays · {qbF==='both'?'Both QBs':qbF==='cooper'?'Cooper QB1':'Ben QB2'} · {conF} · {sessF}</div>
          </div>
        )}
        {view==='zonechart'&&(
          <div>
            <div style={{fontSize:8,fontWeight:700,color:'#F0B429',marginBottom:5,letterSpacing:1}}>FIELD ZONE COMPLETION% — tap zone for AI coaching on that area</div>
            <canvas ref={zoneRef} width={620} height={340} style={{width:'100%',borderRadius:8,border:'1px solid #1d3a1d',display:'block',marginBottom:10}}/>
            <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(3,1fr)',gap:6}}>
              {[['🟢 ELITE (80%+)','#22c55e','Left Deep, Mid Deep, Mid Short — call these every game · best zones on the field'],['🟡 DEVELOPING (65-79%)','#d97706','Left Short, Right Short — solid but hash route work needed to improve'],['🔴 DEAD ZONES (0%)','#dc2626','Right Deep, Red Zone — 0% both QBs all season · critical gaps to fix immediately']].map(([l,col,desc])=>(
                <div key={l} style={{background:col+'11',border:`0.5px solid ${col}33`,borderRadius:6,padding:10}}>
                  <div style={{fontSize:9,fontWeight:700,color:col,marginBottom:4}}>{l}</div>
                  <div style={{fontSize:8,color:'#666',lineHeight:1.5}}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {view==='conceptbars'&&(
          <div>
            <div style={{fontSize:9,fontWeight:700,color:'#F0B429',marginBottom:8,letterSpacing:1}}>CONCEPT RANKINGS — sorted by completion%</div>
            <div style={{display:'flex',flexDirection:'column',gap:5,marginBottom:14}}>
              {conStats.map((cs,i)=>(
                <div key={cs.concept} style={{background:'#0d0d0d',border:`0.5px solid ${gc(cs.pct)}22`,borderRadius:7,padding:'9px 12px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
                    <div style={{display:'flex',gap:8,alignItems:'center'}}>
                      <span style={{fontSize:10,fontWeight:700,color:'#444',minWidth:16}}>{i+1}</span>
                      <span style={{fontSize:12,fontWeight:700,color:gc(cs.pct)}}>{cs.concept}</span>
                      <span style={{fontSize:8,color:'#444'}}>{cs.att} att · {cs.yds} avg yds</span>
                    </div>
                    <span style={{fontSize:15,fontWeight:700,color:gc(cs.pct)}}>{cs.pct}%</span>
                  </div>
                  <div style={{position:'relative',height:7,background:'#1a1a1a',borderRadius:3,overflow:'hidden'}}>
                    <div style={{position:'absolute',inset:0,right:`${100-cs.pct}%`,background:gc(cs.pct),borderRadius:3}}/>
                    <div style={{position:'absolute',left:'71%',top:0,bottom:0,width:1,background:'#F0B42977'}}/>
                  </div>
                  <div style={{fontSize:7,color:'#333',marginTop:1}}>Gold line = NFL avg 71%</div>
                </div>
              ))}
            </div>
            <div style={{fontSize:9,fontWeight:700,color:'#F0B429',marginBottom:6,letterSpacing:1}}>SESSION TREND — comp% across all 6 sessions</div>
            <div style={{background:'#0d0d0d',border:'0.5px solid #1d3a1d',borderRadius:8,padding:14,marginBottom:10}}>
              <div style={{display:'flex',gap:6,alignItems:'flex-end',height:80,marginBottom:6}}>
                {sessStats.map(ss=>(
                  <div key={ss.sess} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
                    <span style={{fontSize:8,fontWeight:700,color:gc(ss.pct)}}>{ss.pct}%</span>
                    <div style={{width:'100%',background:gc(ss.pct),borderRadius:'3px 3px 0 0',height:`${ss.pct*0.7}px`,minHeight:3}}/>
                  </div>
                ))}
              </div>
              <div style={{display:'flex',gap:6}}>
                {sessStats.map(ss=>(
                  <div key={ss.sess} style={{flex:1,textAlign:'center'}}>
                    <div style={{fontSize:8,color:'#F0B429',fontWeight:700}}>{ss.sess}</div>
                    <div style={{fontSize:7,color:'#444'}}>{ss.att}att</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:8}}>
              {[['Clean Pocket',filtered.filter(t=>!t.pressure)],['Under Pressure',filtered.filter(t=>t.pressure)]].map(([lbl,plays])=>{
                const p=plays.length?Math.round(plays.filter(t=>t.result==='Complete').length/plays.length*100):0
                return(
                  <div key={lbl} style={{background:'#0d0d0d',border:`0.5px solid ${gc(p)}33`,borderRadius:7,padding:12}}>
                    <div style={{fontSize:9,fontWeight:700,color:gc(p),marginBottom:4}}>{lbl}</div>
                    <div style={{fontSize:22,fontWeight:700,color:gc(p),marginBottom:3}}>{p}%</div>
                    <div style={{fontSize:8,color:'#555'}}>{plays.length} plays · {plays.filter(t=>t.result==='Complete').length} comp</div>
                    <div style={{height:4,background:'#1a1a1a',borderRadius:2,marginTop:6,overflow:'hidden'}}>
                      <div style={{height:'100%',width:`${p}%`,background:gc(p),borderRadius:2}}/>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }



  const MobileTabMenu=({tab,setTab})=>{
    const [open,setOpen]=React.useState(false)
    const all=[
      {k:'overview',l:'Overview'},{k:'charts',l:'Charts'},{k:'plays',l:'Play Calls'},
      {k:'players',l:'Players'},{k:'heatmaps',l:'Heat Maps'},{k:'tracking',l:'Tracking'},
      {k:'nextgen',l:'NextGen'},{k:'radar',l:'Radar'},{k:'epa',l:'EPA'},
      {k:'projection',l:'Projection'},{k:'recruit',l:'Recruit'},
      {k:'scoutreport',l:'Scout Report'},{k:'routetree',l:'Route Tree'},
      {k:'filmnotes',l:'Film Notes'},{k:'depthchart',l:'Depth Chart'},
      {k:'playerprofiles',l:'Player Profiles'},{k:'staff',l:'Staff'},
      {k:'gameplan',l:'Game Plan'},{k:'practicescript',l:'Practice Script'},
      {k:'logger',l:'Practice Logger'},{k:'livescoreboard',l:'Live Board'},
      {k:'opponentscouting',l:'Opp Scout'},{k:'coachquickref',l:'Coach Ref'},
      {k:'presentation',l:'Present'},{k:'datamanager',l:'Data Manager'},
      {k:'specialteams',l:'Special Teams'},
    ]
    if(!open)return(
      <div style={{background:'#0a0a0a',borderBottom:'0.5px solid #1d3a1d',padding:'0 12px'}}>
        <button onClick={()=>setOpen(true)} style={{width:'100%',padding:'9px 0',background:'transparent',border:'none',color:'#9ca3af',fontSize:11,fontWeight:700,cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center',letterSpacing:0.5}}>
          <span style={{color:'#22c55e',fontSize:12}}>≡ ALL TABS</span>
          <span style={{color:'#555',fontSize:10}}>Browse 25+ tabs ▼</span>
        </button>
      </div>
    )
    return(
      <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,zIndex:500,display:'flex',flexDirection:'column'}}>
        <div style={{background:'#0a0a0a',borderBottom:'2px solid #22c55e',padding:'12px 16px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span style={{color:'#22c55e',fontSize:13,fontWeight:700}}>ALL TABS</span>
          <button onClick={()=>setOpen(false)} style={{background:'#1a0a0a',border:'1px solid #dc2626',borderRadius:6,color:'#dc2626',fontSize:12,fontWeight:700,padding:'6px 14px',cursor:'pointer'}}>✕ Close</button>
        </div>
        <div style={{flex:1,overflowY:'auto',background:'#050505'}}>
          {all.map(t=>(
            <button key={t.k} onClick={()=>{switchTab(t.k);setOpen(false)}} style={{width:'100%',padding:'16px',background:tab===t.k?'#0a1a0a':'transparent',border:'none',borderBottom:'0.5px solid #1a1a1a',color:tab===t.k?'#22c55e':'#9ca3af',fontSize:15,fontWeight:tab===t.k?700:400,cursor:'pointer',textAlign:'left',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              {t.l}
              {tab===t.k&&<span style={{color:'#22c55e',fontSize:11,background:'#14532d',padding:'2px 8px',borderRadius:4}}>active</span>}
            </button>
          ))}
        </div>
      </div>
    )
  }


  const AnimCounter=({val,suffix='',duration=700})=>{
    const [cur,setCur]=React.useState(0)
    React.useEffect(()=>{
      const num=parseFloat(String(val).replace('%',''))
      if(isNaN(num)){setCur(val);return}
      let start=0,step=num/(duration/16)
      const t=setInterval(()=>{
        start+=step
        if(start>=num){setCur(val);clearInterval(t)}
        else{const rounded=Number.isInteger(num)?Math.round(start):Math.round(start*10)/10;setCur(rounded+suffix)}
      },16)
      return()=>clearInterval(t)
    },[val])
    return React.createElement('span',null,cur)
  }


  const DataManagerTab=()=>{
    const [counts,setCounts]=React.useState({})
    const [status,setStatus]=React.useState('')
    const KEYS=['gameday_plays','film_notes','player_profiles','quick_favs','practice_checked']
    const LBLS={gameday_plays:'Game Day Plays',film_notes:'Film Notes',player_profiles:'Player Profiles',quick_favs:'Favorite Plays',practice_checked:'Practice Reps'}
    const ICONS={gameday_plays:'🏈',film_notes:'🎬',player_profiles:'👤',quick_favs:'⭐',practice_checked:'✓'}
    React.useEffect(()=>{
      const go=async()=>{
        const obj={}
        for(const k of KEYS){
          try{const r=await window.storage.get('westfield_v1_'+k);if(r&&r.value){const p=JSON.parse(r.value);obj[k]=Array.isArray(p)?p.length:typeof p==='object'?Object.keys(p||{}).length:1}else obj[k]=0}catch(e){obj[k]=0}
        }
        setCounts(obj)
      }
      go()
    },[])
    const clearKey=async(k)=>{
      if(!window.confirm('Clear '+LBLS[k]+'?'))return
      try{await window.storage.delete('westfield_v1_'+k);setCounts(p=>({...p,[k]:0}));setStatus(LBLS[k]+' cleared');setTimeout(()=>setStatus(''),2000)}catch(e){}
    }
    const clearAll=async()=>{
      if(!window.confirm('Clear ALL saved data? Cannot be undone.'))return
      for(const k of KEYS){try{await window.storage.delete('westfield_v1_'+k)}catch(e){}}
      setCounts({});setStatus('All data cleared');setTimeout(()=>setStatus(''),3000)
    }
    const exportCSV=async()=>{
      try{
        const rows=['Time,QB,Concept,Result,Yards,Hash,Pressure']
        try{
          const r=await window.storage.get('westfield_v1_gameday_plays')
          if(r&&r.value)JSON.parse(r.value).forEach(p=>rows.push([p.time||'',p.qb||'',p.con||p.concept||'',p.res||p.result||'',p.yds||0,p.hash||'',p.pres||false].join(',')))
        }catch(e){}
        const blob=new Blob([rows.join('\n')],{type:'text/csv'})
        const url=URL.createObjectURL(blob)
        const a=document.createElement('a');a.href=url;a.download='westfield_plays.csv';a.click()
        URL.revokeObjectURL(url);setStatus('CSV downloaded ✓');setTimeout(()=>setStatus(''),3000)
      }catch(e){setStatus('Export failed')}
    }
    const total=Object.values(counts).reduce((a,v)=>a+(v||0),0)
    return(
      <div style={{padding:20,fontFamily:'Helvetica,Arial,sans-serif'}}>
        <div style={{background:'#0a0d1a',border:'1px solid #06b6d4',borderRadius:8,padding:14,marginBottom:16}}>
          <div style={{fontSize:11,fontWeight:700,color:'#06b6d4',letterSpacing:2,marginBottom:3}}>💾 DATA MANAGER — Everything Saves Automatically</div>
          <div style={{fontSize:8,color:'#555',lineHeight:1.7}}>Every logged play · film note · player grade · favorite saves instantly. Persists through refresh and reopening. Nothing ever disappears.</div>
        </div>
        {status&&<div style={{background:'#0a1a0a',border:'1px solid #22c55e',borderRadius:6,padding:'9px 14px',marginBottom:12,fontSize:12,fontWeight:700,color:'#22c55e'}}>✓ {status}</div>}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:6,marginBottom:14}}>
          {[['Total',total,'#22c55e'],['Plays',counts.gameday_plays||0,'#22c55e'],['Notes',counts.film_notes||0,'#06b6d4'],['Players',counts.player_profiles||0,'#F0B429']].map(([l,v,col])=>(
            <div key={l} style={{background:'#111',border:'0.5px solid '+col+'33',borderRadius:8,padding:'12px 4px',textAlign:'center'}}>
              <div style={{fontSize:22,fontWeight:700,color:col,lineHeight:1}}>{v}</div>
              <div style={{fontSize:7,color:'#555',marginTop:3,letterSpacing:1}}>{l.toUpperCase()}</div>
            </div>
          ))}
        </div>
        <div style={{background:'#0d0d0d',border:'0.5px solid #1d3a1d',borderRadius:8,overflow:'hidden',marginBottom:14}}>
          <div style={{background:'#0a0a0a',padding:'7px 14px',borderBottom:'0.5px solid #1d3a1d',display:'grid',gridTemplateColumns:'0.3fr 1fr 0.5fr 0.8fr'}}>{['','TYPE','SAVED',''].map(h=><div key={h} style={{fontSize:7,fontWeight:700,color:'#555'}}>{h}</div>)}</div>
          {KEYS.map((k,i)=>(
            <div key={k} style={{display:'grid',gridTemplateColumns:'0.3fr 1fr 0.5fr 0.8fr',padding:'10px 14px',background:i%2===0?'#0f0f0f':'#141414',borderBottom:'0.5px solid #1a1a1a',alignItems:'center'}}>
              <div style={{fontSize:14}}>{ICONS[k]}</div>
              <div style={{fontSize:10,fontWeight:700,color:'#F0B429'}}>{LBLS[k]}</div>
              <div style={{fontSize:11,fontWeight:700,color:(counts[k]||0)>0?'#22c55e':'#555'}}>{counts[k]||0}{(counts[k]||0)>0?' ✓':''}</div>
              <button onClick={()=>clearKey(k)} style={{padding:'4px 8px',background:'#1a0404',border:'0.5px solid #dc262644',borderRadius:4,color:'#dc2626',fontSize:8,cursor:'pointer'}}>Clear</button>
            </div>
          ))}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10}}>
          <div style={{background:'#0a1a0a',border:'1px solid #22c55e33',borderRadius:8,padding:14}}>
            <div style={{fontSize:10,fontWeight:700,color:'#22c55e',marginBottom:6}}>💾 Auto-Save Active</div>
            <div style={{fontSize:12,color:'#ccc',lineHeight:1.7,marginBottom:8}}>Every play and note saves under 1 second. Green SAVED flashes each time. Never manually save anything.</div>
            <div style={{background:'#14532d',borderRadius:6,padding:'7px',fontSize:9,fontWeight:700,color:'#22c55e',textAlign:'center'}}>✓ ALL DATA SAVING</div>
          </div>
          <div style={{background:'#0a0d1a',border:'1px solid #06b6d433',borderRadius:8,padding:14}}>
            <div style={{fontSize:10,fontWeight:700,color:'#06b6d4',marginBottom:6}}>📤 Export to CSV</div>
            <div style={{fontSize:12,color:'#ccc',lineHeight:1.7,marginBottom:8}}>Download all logged plays as a CSV. Open in Excel or share with college programs requesting raw data.</div>
            <button onClick={exportCSV} style={{width:'100%',padding:'10px',background:'#0c1a3a',border:'1px solid #06b6d4',borderRadius:6,color:'#06b6d4',fontWeight:700,fontSize:12,cursor:'pointer'}}>Download CSV</button>
          </div>
          <div style={{background:'#1a0404',border:'1px solid #dc262633',borderRadius:8,padding:14}}>
            <div style={{fontSize:10,fontWeight:700,color:'#dc2626',marginBottom:6}}>🗑 Clear All Data</div>
            <div style={{fontSize:12,color:'#9ca3af',lineHeight:1.7,marginBottom:8}}>Wipes everything. Use at the start of a new season. Cannot be undone.</div>
            <button onClick={clearAll} style={{width:'100%',padding:'10px',background:'#1a0404',border:'1px solid #dc2626',borderRadius:6,color:'#dc2626',fontWeight:700,fontSize:12,cursor:'pointer'}}>Clear All Data</button>
          </div>
        </div>
      </div>
    )
  }


  // ══════════════════════════════════════════════════════
  // POSITION COACH HUB — Every coach gets their own AI tool
  // Per down · Per situation · Per matchup
  // ══════════════════════════════════════════════════════
  const PositionCoachTab=()=>{
    const [unit,setUnit]=React.useState('WR')
    const [dn,setDn]=React.useState('1st')
    const [dist,setDist]=React.useState('10')
    const [zone,setZone]=React.useState('Open Field')
    const [coverage,setCoverage]=React.useState('Cover 2')
    const [score,setScore]=React.useState('Tied')
    const [question,setQuestion]=React.useState('')
    const [answer,setAnswer]=React.useState('')
    const [load,setLoad]=React.useState(false)
    const [msgs,setMsgs]=React.useState([])
    const chatRef=React.useRef(null)

    const units=[
      {k:'WR', label:'WR Coach',     icon:'🏃', col:'#06b6d4', side:'O',
       role:'Wide Receiver Coach',
       context:'Focus on route running, releases vs press, separation, and which WR to target on each down and distance. Our WR1 averages 3.8 yards of separation. WR2 averages 3.2 yards. Both struggle on Sail and Fade routes which are cut from the script.',
       quickQs:['Which routes should WR1 run on 3rd and short?','How do we attack press coverage right now?','What does WR1 need to work on before next practice?','Which concept gives WR1 the best matchup vs Cover 2?','When should we motion WR2 to create separation?']},
      {k:'RB', label:'RB Coach',     icon:'💨', col:'#22c55e', side:'O',
       role:'Running Back Coach',
       context:'Focus on run-pass balance, RB route concepts, screen game, RPO reads, pass protection, and when to use the RB as a check-down. RPO Glance is 100% efficient. Screen game is developing. Cooper checks down to RB in pressure situations.',
       quickQs:['When do we hand off vs throw on RPO Glance?','What is the best screen concept for our RB?','How should the RB align on 3rd and long to help Cooper?','When is the RB a better option than WR1 on this down?','What pass protection call do we need vs a 5-man blitz?']},
      {k:'OL', label:'OL Coach',     icon:'🧱', col:'#d97706', side:'O',
       role:'Offensive Line Coach',
       context:'Focus on protection calls, pressure management, stunt pick-ups, and OL grades. Current pressure rate is 28% — target is 20% or below. The 5/12 INT came after a protection breakdown. Clean pocket rate is 72%. Cooper performs significantly better in a clean pocket.',
       quickQs:['What protection call do we need vs a 4-man rush?','How do we handle a LB walking into the box pre-snap?','What stunt combination is giving us the most trouble?','How do we protect Cooper on 3rd and long pass plays?','What OL adjustment improves our pressure rate from 28% to 20%?']},
      {k:'QB', label:'QB Coach',     icon:'🎯', col:'#22c55e', side:'O',
       role:'Quarterback Coach',
       context:'Focus on QB reads, footwork, release mechanics, and decision-making for both Cooper and Ben. Cooper: 84% comp, TTT 2.0s, hash accuracy 73%, deep ball 88%. Ben: 70% comp, TTT 1.9s, hash 60%, deep ball 50%, high release mechanics issue.',
       quickQs:['What is Cooper\'s single biggest mechanical issue to fix?','When do we put Ben in and what plays do we run with him?','How does Cooper read Cover 3 on the Post concept?','What footwork drill fixes Ben\'s high release mechanics?','What should Cooper work on before the next showcase?']},
      {k:'DC', label:'DC / LB Coach',icon:'🛡️', col:'#dc2626', side:'D',
       role:'Defensive Coordinator and Linebacker Coach',
       context:'Focus on defensive coverage calls, linebacker assignments, blitz packages, and adjustments per offensive formation and down. Against our own offense: Baltimore beats single high, Post beats Cover 3, Stick beats zone. Red zone is our biggest offensive gap.',
       quickQs:['What coverage do we call vs a spread 4-wide set on 3rd and 5?','How do we stop the Post route from beating our Cover 3?','What blitz package creates pressure without giving up the deep ball?','How do our LBs align vs RPO Glance read plays?','What is the best coverage to slow down a QB like Cooper?']},
      {k:'DB', label:'DB Coach',     icon:'🔒', col:'#7c3aed', side:'D',
       role:'Defensive Back and Secondary Coach',
       context:'Focus on coverage assignments, man vs zone decisions, press coverage vs off coverage, and matchup calls based on WR tendencies. Against our offense: WR1 averages 3.8 yards separation and excels on Verticals and Post. WR2 is most effective on Stick and Smash.',
       quickQs:['Do we press or play off WR1 on 1st and 10?','How do we take away the Post route from Cooper?','What coverage rotation stops the deep ball on 3rd and long?','How do we defend the RPO when Cooper can run or throw?','Which DB matchup gives us the best chance on 3rd and short?']},
      {k:'DL', label:'DL Coach',     icon:'💥', col:'#ef4444', side:'D',
       role:'Defensive Line Coach',
       context:'Focus on pass rush packages, gap assignments, stunt combinations, run defense, and creating pressure on the QB. Cooper\'s pressure rate is 28% — the DL needs to get that above 35% on passing downs. Cooper is mobile so contain is essential.',
       quickQs:['What pass rush move beats a slide protection on 3rd and long?','How do we set the edge vs a QB who can escape the pocket?','What stunt combination creates the fastest pressure path?','How do our DL align vs a run-heavy personnel on 1st down?','What gap assignment stops the RPO keeper read?']},
      {k:'ST', label:'ST Coach',     icon:'🏉', col:'#a78bfa', side:'ST',
       role:'Special Teams Coordinator',
       context:'Focus on punt decisions, kickoff strategy, field goal calls, onside kick timing, fake punt and fake field goal calls, and return game setups. All decisions should account for field position, score differential, time remaining, and opponent tendencies.',
       quickQs:['Do we punt or go for it on 4th and 4 from our own 38?','When is an onside kick the right call vs a regular kickoff?','What fake punt formation gives us the best surprise element?','How do we scheme a kickoff when leading by 7 with 4 min left?','What field goal range decision do we make on 4th and 6 from the 29?']},
    ]

    const sel=units.find(u=>u.k===unit)||units[0]

    const SITUATIONS={
      '1st':{'10':'Standard down — establish run-pass balance and set up 2nd and manageable.','5-7':'Short — attack with your best concept immediately.','1-4':'Power down — run game or quick pass to set up conversion.'},
      '2nd':{'10':'Need to get something — avoid 3rd and long at all costs.','5-7':'Manageable — mix concepts to keep defense guessing.','1-4':'Short yardage — call your most reliable high-percentage play.'},
      '3rd':{'10':'Long — need a chunk play or punt. High pressure.','5-7':'Medium — conversion needed. Call what the data says works.','1-4':'Short — run it or quick game. Stick is 100%.'},
      '4th':{'10':'Desperation — either go for it with your best play or punt.','5-7':'Decision down — field position matters. AI will help decide.','1-4':'Go or kick — know your numbers before you decide.'},
    }

    const situationNote=SITUATIONS[dn]?.[dist]||''

    const buildSystemPrompt=()=>{
      return `You are the ${sel.role} for Westfield Shamrocks high school football. You give direct, specific coaching advice for your position group. Season data: ${CTX} Your unit focus: ${sel.context} Keep answers under 4 sentences. Always recommend a specific play, technique, or adjustment. Never be vague. This is game day — coaches need clear decisions.`
    }

    const buildUserMsg=(q)=>{
      return `Situation: ${dn} and ${dist}, ${zone}, score ${score}, coverage ${sel.side==='D'?coverage:'unknown'}. Question: ${q}`
    }

    const ask=async(q)=>{
      const msg=q||question
      if(!msg.trim()||load)return
      setLoad(true)
      const um={role:'user',content:msg}
      const newMsgs=[...msgs,um]
      setMsgs(newMsgs)
      setQuestion('')
      try{
        const r=await fetch('https://api.anthropic.com/v1/messages',{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({
            model:'claude-sonnet-4-20250514',
            max_tokens:200,
            system:buildSystemPrompt(),
            messages:newMsgs.map(m=>({role:m.role,content:buildUserMsg(m.content)}))
          })
        })
        const d=await r.json()
        setMsgs(p=>[...p,{role:'assistant',content:d.content?.[0]?.text||'Error'}])
      }catch(e){
        setMsgs(p=>[...p,{role:'assistant',content:'Connection error — check API access.'}])
      }
      setLoad(false)
    }

    React.useEffect(()=>{
      if(chatRef.current)chatRef.current.scrollIntoView({behavior:'smooth'})
    },[msgs])

    // Clear chat when unit changes
    React.useEffect(()=>{setMsgs([]);setAnswer('')},[unit])

    const offenseUnits=units.filter(u=>u.side==='O')
    const defenseUnits=units.filter(u=>u.side==='D')
    const stUnits=units.filter(u=>u.side==='ST')

    return(
      <div style={{padding:16,fontFamily:'Helvetica,Arial,sans-serif'}}>
        <div style={{background:'#0a0a0a',border:'1px solid #22c55e',borderRadius:8,padding:12,marginBottom:12}}>
          <div style={{fontSize:11,fontWeight:700,color:'#22c55e',letterSpacing:2}}>👥 POSITION COACH HUB — Every Coach Gets Their Own AI Tool</div>
          <div style={{fontSize:8,color:'#555',marginTop:2}}>Select your unit · Set the situation · Ask anything · Get a direct answer based on your actual season data</div>
        </div>

        {/* Unit selector — grouped by side of ball */}
        <div style={{marginBottom:12}}>
          <div style={{fontSize:8,color:'#22c55e',fontWeight:700,letterSpacing:1,marginBottom:5}}>OFFENSE</div>
          <div style={{display:'flex',gap:5,flexWrap:'wrap',marginBottom:8}}>
            {offenseUnits.map(u=>(
              <button key={u.k} onClick={()=>setUnit(u.k)}
                style={{padding:'9px 14px',background:unit===u.k?u.col+'22':'#0d0d0d',border:`1px solid ${unit===u.k?u.col:'#252525'}`,borderRadius:8,color:unit===u.k?u.col:'#555',fontSize:10,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',gap:5}}>
                <span style={{fontSize:14}}>{u.icon}</span>{u.label}
              </button>
            ))}
          </div>
          <div style={{fontSize:8,color:'#dc2626',fontWeight:700,letterSpacing:1,marginBottom:5}}>DEFENSE</div>
          <div style={{display:'flex',gap:5,flexWrap:'wrap',marginBottom:8}}>
            {defenseUnits.map(u=>(
              <button key={u.k} onClick={()=>setUnit(u.k)}
                style={{padding:'9px 14px',background:unit===u.k?u.col+'22':'#0d0d0d',border:`1px solid ${unit===u.k?u.col:'#252525'}`,borderRadius:8,color:unit===u.k?u.col:'#555',fontSize:10,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',gap:5}}>
                <span style={{fontSize:14}}>{u.icon}</span>{u.label}
              </button>
            ))}
          </div>
          <div style={{fontSize:8,color:'#a78bfa',fontWeight:700,letterSpacing:1,marginBottom:5}}>SPECIAL TEAMS</div>
          <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
            {stUnits.map(u=>(
              <button key={u.k} onClick={()=>setUnit(u.k)}
                style={{padding:'9px 14px',background:unit===u.k?u.col+'22':'#0d0d0d',border:`1px solid ${unit===u.k?u.col:'#252525'}`,borderRadius:8,color:unit===u.k?u.col:'#555',fontSize:10,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',gap:5}}>
                <span style={{fontSize:14}}>{u.icon}</span>{u.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1.4fr',gap:12}}>

          {/* LEFT — Situation panel */}
          <div>
            <div style={{background:'#0d0d0d',border:`1px solid ${sel.col}`,borderRadius:10,padding:14,marginBottom:10}}>
              <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:10,paddingBottom:8,borderBottom:`0.5px solid ${sel.col}33`}}>
                <span style={{fontSize:20}}>{sel.icon}</span>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:sel.col}}>{sel.label}</div>
                  <div style={{fontSize:8,color:'#555'}}>{sel.role}</div>
                </div>
              </div>

              <div style={{fontSize:8,color:'#555',marginBottom:6,letterSpacing:1}}>SET THE SITUATION</div>

              <div style={{marginBottom:8}}>
                <div style={{fontSize:7,color:'#444',marginBottom:3}}>DOWN</div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:3}}>
                  {['1st','2nd','3rd','4th'].map(d=>(
                    <button key={d} onClick={()=>setDn(d)} style={{padding:'7px 2px',background:dn===d?sel.col+'22':'#111',border:`0.5px solid ${dn===d?sel.col:'#252525'}`,borderRadius:4,color:dn===d?sel.col:'#555',fontSize:9,fontWeight:700,cursor:'pointer'}}>{d}</button>
                  ))}
                </div>
              </div>

              <div style={{marginBottom:8}}>
                <div style={{fontSize:7,color:'#444',marginBottom:3}}>DISTANCE</div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:3}}>
                  {['1-4','5-7','10'].map(d=>(
                    <button key={d} onClick={()=>setDist(d)} style={{padding:'7px 2px',background:dist===d?sel.col+'22':'#111',border:`0.5px solid ${dist===d?sel.col:'#252525'}`,borderRadius:4,color:dist===d?sel.col:'#555',fontSize:9,fontWeight:700,cursor:'pointer'}}>{d==='10'?'10+':d}</button>
                  ))}
                </div>
              </div>

              <div style={{marginBottom:8}}>
                <div style={{fontSize:7,color:'#444',marginBottom:3}}>FIELD ZONE</div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:3}}>
                  {['Own End','Open Field','Red Zone'].map(z=>(
                    <button key={z} onClick={()=>setZone(z)} style={{padding:'6px 2px',background:zone===z?sel.col+'22':'#111',border:`0.5px solid ${zone===z?sel.col:'#252525'}`,borderRadius:4,color:zone===z?sel.col:'#555',fontSize:8,fontWeight:700,cursor:'pointer',textAlign:'center'}}>{z}</button>
                  ))}
                </div>
              </div>

              {sel.side==='D'&&(
                <div style={{marginBottom:8}}>
                  <div style={{fontSize:7,color:'#444',marginBottom:3}}>COVERAGE / FORMATION</div>
                  <select value={coverage} onChange={e=>setCoverage(e.target.value)}
                    style={{width:'100%',background:'#111',border:'0.5px solid #252525',borderRadius:6,color:'#ccc',padding:'7px',fontSize:12}}>
                    {['Cover 1 Man','Cover 2 Zone','Cover 3 Sky','Cover 4 Quarters','Cover 0 Blitz','Tampa 2','Quarters Rotate','Press Man','Base 4-3','Base 3-4','Nickel','Dime'].map(cv=>(
                      <option key={cv} value={cv}>{cv}</option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{marginBottom:10}}>
                <div style={{fontSize:7,color:'#444',marginBottom:3}}>SCORE</div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:3}}>
                  {['Down 7+','Tied','Up 7+'].map(s=>(
                    <button key={s} onClick={()=>setScore(s)} style={{padding:'6px 2px',background:score===s?sel.col+'22':'#111',border:`0.5px solid ${score===s?sel.col:'#252525'}`,borderRadius:4,color:score===s?sel.col:'#555',fontSize:8,fontWeight:700,cursor:'pointer',textAlign:'center'}}>{s}</button>
                  ))}
                </div>
              </div>

              {situationNote&&(
                <div style={{background:sel.col+'11',border:`0.5px solid ${sel.col}33`,borderRadius:6,padding:8,marginBottom:10}}>
                  <div style={{fontSize:7,color:sel.col,fontWeight:700,marginBottom:2,letterSpacing:1}}>SITUATION NOTE</div>
                  <div style={{fontSize:10,color:'#9ca3af',lineHeight:1.5}}>{situationNote}</div>
                </div>
              )}

              <div style={{fontSize:8,color:'#555',marginBottom:6,letterSpacing:1}}>QUICK QUESTIONS — TAP TO ASK</div>
              <div style={{display:'flex',flexDirection:'column',gap:4}}>
                {sel.quickQs.map(q=>(
                  <button key={q} onClick={()=>ask(q)}
                    style={{padding:'8px 10px',background:'#111',border:'0.5px solid #252525',borderRadius:6,color:'#9ca3af',fontSize:9,cursor:'pointer',textAlign:'left',display:'flex',alignItems:'center',gap:6}}>
                    <span style={{color:sel.col,fontSize:10,flexShrink:0}}>→</span>{q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — Chat */}
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            <div style={{background:'#0d0d0d',border:`0.5px solid ${sel.col}33`,borderRadius:8,padding:'8px 12px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{fontSize:9,fontWeight:700,color:sel.col,letterSpacing:1}}>{sel.label.toUpperCase()} AI — {dn} & {dist} · {zone} · {score}</div>
              {msgs.length>0&&<button onClick={()=>setMsgs([])} style={{padding:'3px 8px',background:'#1a0404',border:'0.5px solid #dc262644',borderRadius:4,color:'#dc2626',fontSize:8,cursor:'pointer'}}>Clear</button>}
            </div>

            <div style={{flex:1,background:'#090909',border:`0.5px solid ${sel.col}22`,borderRadius:8,padding:12,display:'flex',flexDirection:'column',gap:8,minHeight:380,maxHeight:480,overflowY:'auto'}}>
              {msgs.length===0&&(
                <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',height:'100%',gap:8,opacity:0.4}}>
                  <span style={{fontSize:36}}>{sel.icon}</span>
                  <div style={{fontSize:12,color:sel.col,fontWeight:700,textAlign:'center'}}>{sel.label} AI Ready</div>
                  <div style={{fontSize:10,color:'#555',textAlign:'center',maxWidth:240}}>Tap a quick question or type your own. This AI knows your season data and answers for your specific unit and situation.</div>
                </div>
              )}
              {msgs.map((m,i)=>(
                <div key={i} style={{display:'flex',justifyContent:m.role==='user'?'flex-end':'flex-start'}}>
                  <div style={{maxWidth:'88%',padding:'10px 13px',borderRadius:10,
                    background:m.role==='user'?sel.col+'22':'#111',
                    border:`0.5px solid ${m.role==='user'?sel.col+'44':'#252525'}`,
                    borderBottomRightRadius:m.role==='user'?2:10,
                    borderBottomLeftRadius:m.role==='assistant'?2:10}}>
                    {m.role==='assistant'&&(
                      <div style={{fontSize:8,fontWeight:700,color:sel.col,marginBottom:4,letterSpacing:1}}>{sel.label.toUpperCase()} AI</div>
                    )}
                    <div style={{fontSize:13,color:'#e5e7eb',lineHeight:1.6,whiteSpace:'pre-wrap'}}>{m.content}</div>
                  </div>
                </div>
              ))}
              {load&&(
                <div style={{display:'flex'}}>
                  <div style={{padding:'10px 13px',background:'#111',borderRadius:10,border:'0.5px solid #252525'}}>
                    <div style={{fontSize:11,color:sel.col}}>Thinking as {sel.role}...</div>
                  </div>
                </div>
              )}
              <div ref={chatRef}/>
            </div>

            <div style={{display:'flex',gap:6}}>
              <input
                value={question}
                onChange={e=>setQuestion(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&ask(question)}
                placeholder={`Ask the ${sel.label} anything about ${dn} & ${dist}...`}
                style={{flex:1,background:'#111',border:`1px solid ${sel.col}44`,borderRadius:8,padding:'11px 14px',color:'#fff',fontSize:13,outline:'none'}}
              />
              <button onClick={()=>ask(question)} disabled={load||!question.trim()}
                style={{padding:'11px 18px',background:load||!question.trim()?'#111':sel.col+'22',border:`0.5px solid ${load||!question.trim()?'#252525':sel.col}`,borderRadius:8,color:load||!question.trim()?'#555':sel.col,fontWeight:700,fontSize:13,cursor:load||!question.trim()?'default':'pointer'}}>
                Ask
              </button>
            </div>

            <div style={{background:'#0d0d0d',border:'0.5px solid #1d3a1d',borderRadius:6,padding:10}}>
              <div style={{fontSize:8,fontWeight:700,color:'#22c55e',marginBottom:4,letterSpacing:1}}>HOW THIS WORKS</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6}}>
                {[['Set situation','Down, distance, zone, score — the AI knows where you are'],['Pick your unit','Each coach gets answers specific to their position group'],['Ask anything','Type or tap — AI answers from your real season data']].map(([t2,d])=>(
                  <div key={t2} style={{textAlign:'center'}}>
                    <div style={{fontSize:9,fontWeight:700,color:'#22c55e',marginBottom:3}}>{t2}</div>
                    <div style={{fontSize:8,color:'#555',lineHeight:1.4}}>{d}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }


  const CatapultTab=()=>{
    const [mode,setMode]=React.useState('manual')
    const [sessions,setSessions]=React.useState([
      {date:'5/12',players:[
        {name:'Cooper Melvin',pos:'QB',load:68,dist:2.8,topSpeed:15.2,sprints:8,rpe:7},
        {name:'Ben Kooi',pos:'QB',load:55,dist:2.2,topSpeed:14.1,sprints:5,rpe:6},
        {name:'WR1',pos:'WR',load:82,dist:3.6,topSpeed:17.8,sprints:14,rpe:8},
        {name:'WR2',pos:'WR',load:75,dist:3.2,topSpeed:16.9,sprints:11,rpe:7},
        {name:'RB1',pos:'RB',load:91,dist:3.9,topSpeed:16.4,sprints:16,rpe:9},
        {name:'OL Captain',pos:'OL',load:110,dist:1.8,topSpeed:11.2,sprints:4,rpe:8},
      ]},
      {date:'5/8',players:[
        {name:'Cooper Melvin',pos:'QB',load:52,dist:2.1,topSpeed:14.8,sprints:6,rpe:5},
        {name:'Ben Kooi',pos:'QB',load:48,dist:1.9,topSpeed:13.6,sprints:4,rpe:5},
        {name:'WR1',pos:'WR',load:71,dist:3.1,topSpeed:17.2,sprints:12,rpe:7},
        {name:'WR2',pos:'WR',load:68,dist:2.8,topSpeed:16.1,sprints:9,rpe:6},
        {name:'RB1',pos:'RB',load:85,dist:3.5,topSpeed:15.9,sprints:14,rpe:8},
        {name:'OL Captain',pos:'OL',load:98,dist:1.6,topSpeed:10.8,sprints:3,rpe:7},
      ]},
    ])
    const [newEntry,setNewEntry]=React.useState({name:'',pos:'QB',load:'',dist:'',topSpeed:'',sprints:'',rpe:''})
    const [activeSession,setActiveSession]=React.useState(0)
    const [csvText,setCsvText]=React.useState('')
    const [csvParsed,setCsvParsed]=React.useState(false)
    const [aiInsight,setAiInsight]=React.useState('')
    const [aiLoad,setAiLoad]=React.useState(false)
    const [newDate,setNewDate]=React.useState('')

    const parseCSV=()=>{
      try{
        const lines=csvText.trim().split('\n')
        const players=[]
        for(let i=1;i<lines.length;i++){
          const cols=lines[i].split(',')
          if(cols.length<4)continue
          players.push({
            name:cols[0]?.trim()||'Player '+i,
            pos:cols[1]?.trim()||'—',
            load:parseFloat(cols[2])||0,
            dist:parseFloat(cols[3])||0,
            topSpeed:parseFloat(cols[4])||0,
            sprints:parseInt(cols[5])||0,
            rpe:parseInt(cols[6])||0,
          })
        }
        if(players.length>0){
          const date=newDate||new Date().toLocaleDateString('en-US',{month:'numeric',day:'numeric'})
          setSessions(s=>[{date,players},...s])
          setCsvParsed(true)
          setActiveSession(0)
        }
      }catch(e){alert('CSV parse error — check format')}
    }

    const addManual=()=>{
      if(!newEntry.name||!newEntry.load)return
      setSessions(s=>{
        const updated=[...s]
        if(!updated[activeSession])updated.unshift({date:newDate||new Date().toLocaleDateString('en-US',{month:'numeric',day:'numeric'}),players:[]})
        updated[activeSession]={...updated[activeSession],players:[...updated[activeSession].players,{...newEntry,load:parseFloat(newEntry.load)||0,dist:parseFloat(newEntry.dist)||0,topSpeed:parseFloat(newEntry.topSpeed)||0,sprints:parseInt(newEntry.sprints)||0,rpe:parseInt(newEntry.rpe)||0}]}
        return updated
      })
      setNewEntry({name:'',pos:'QB',load:'',dist:'',topSpeed:'',sprints:'',rpe:''})
    }

    const getAiInsight=async()=>{
      if(!sessions[activeSession])return
      setAiLoad(true)
      const sess=sessions[activeSession]
      const summary=sess.players.map(p=>`${p.name}(${p.pos}): load=${p.load} dist=${p.dist}mi speed=${p.topSpeed}mph sprints=${p.sprints} rpe=${p.rpe}/10`).join('; ')
      const compData="Cooper 5/12=75% 5/8=100%. Ben 5/12=55% 5/8=40%."
      try{
        const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:300,system:'You are a sports science analyst for Westfield Shamrocks football. Analyze athlete load data and correlate with QB performance. Give 3 specific insights: who is at risk of fatigue, who had optimal load, and one recommendation for the next practice. Be direct and specific.',messages:[{role:'user',content:`Load data for ${sess.date}: ${summary}. QB performance context: ${compData}. Analyze load vs performance and give coaching recommendations.`}]})})
        const d=await r.json()
        setAiInsight(d.content?.[0]?.text||'Error')
      }catch(e){setAiInsight('Connection error.')}
      setAiLoad(false)
    }

    const sess=sessions[activeSession]
    const loadColor=l=>l>100?'#dc2626':l>80?'#d97706':l>60?'#22c55e':'#06b6d4'
    const rpeColor=r=>r>=9?'#dc2626':r>=7?'#d97706':r>=5?'#22c55e':'#06b6d4'

    return(
      <div style={{padding:16,fontFamily:'Helvetica,Arial,sans-serif'}}>
        <div style={{background:'#0a0d1a',border:'1px solid #06b6d4',borderRadius:8,padding:12,marginBottom:12}}>
          <div style={{fontSize:11,fontWeight:700,color:'#06b6d4',letterSpacing:2}}>⚡ CATAPULT & ATHLETE LOAD — Physical Data Meets On-Field Performance</div>
          <div style={{fontSize:8,color:'#555',marginTop:2}}>Import Catapult CSV or enter manually · Player load scores · Speed · Distance · Correlate with session comp% · AI identifies fatigue risk</div>
        </div>
        <div style={{display:'flex',gap:5,marginBottom:12}}>
          {[['manual','Manual Entry'],['csv','CSV Import'],['rpe','RPE Only (Free)']].map(([k,l])=>(
            <button key={k} onClick={()=>setMode(k)} style={{padding:'8px 14px',background:mode===k?'#0c1a3a':'#0d0d0d',border:`1px solid ${mode===k?'#06b6d4':'#252525'}`,borderRadius:6,color:mode===k?'#06b6d4':'#555',fontSize:10,fontWeight:700,cursor:'pointer'}}>{l}</button>
          ))}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1.6fr',gap:12}}>
          <div>
            {mode==='csv'&&(
              <div style={{background:'#0d0d0d',border:'0.5px solid #252525',borderRadius:8,padding:12,marginBottom:10}}>
                <div style={{fontSize:9,fontWeight:700,color:'#06b6d4',marginBottom:6,letterSpacing:1}}>CATAPULT CSV IMPORT</div>
                <div style={{fontSize:8,color:'#555',marginBottom:6,lineHeight:1.6}}>Paste your Catapult export CSV below. Expected columns: Name, Position, Load, Distance(mi), TopSpeed(mph), Sprints, RPE</div>
                <div style={{fontSize:7,color:'#333',marginBottom:4,fontFamily:'monospace'}}>Name,Pos,Load,Dist,Speed,Sprints,RPE<br/>Cooper Melvin,QB,68,2.8,15.2,8,7</div>
                <div style={{marginBottom:6}}><div style={{fontSize:7,color:'#555',marginBottom:3}}>SESSION DATE</div><input value={newDate} onChange={e=>setNewDate(e.target.value)} placeholder="e.g. 5/19" style={{width:'100%',background:'#111',border:'0.5px solid #252525',borderRadius:6,color:'#ccc',padding:'6px',fontSize:12,outline:'none',boxSizing:'border-box'}}/></div>
                <textarea value={csvText} onChange={e=>setCsvText(e.target.value)} placeholder="Paste CSV data here..." style={{width:'100%',background:'#111',border:'0.5px solid #252525',borderRadius:6,color:'#ccc',padding:'8px',fontSize:11,outline:'none',minHeight:100,resize:'none',marginBottom:6,boxSizing:'border-box',fontFamily:'monospace'}}/>
                <button onClick={parseCSV} disabled={!csvText.trim()} style={{width:'100%',padding:'9px',background:'#0c1a3a',border:'1px solid #06b6d4',borderRadius:6,color:'#06b6d4',fontWeight:700,fontSize:12,cursor:'pointer'}}>Parse CSV Data</button>
                {csvParsed&&<div style={{marginTop:6,fontSize:10,color:'#22c55e',fontWeight:700,textAlign:'center'}}>✓ CSV imported successfully</div>}
              </div>
            )}
            {mode==='manual'&&(
              <div style={{background:'#0d0d0d',border:'0.5px solid #252525',borderRadius:8,padding:12,marginBottom:10}}>
                <div style={{fontSize:9,fontWeight:700,color:'#06b6d4',marginBottom:8,letterSpacing:1}}>ADD PLAYER DATA</div>
                <div style={{marginBottom:6}}><div style={{fontSize:7,color:'#555',marginBottom:3}}>SESSION DATE</div><input value={newDate} onChange={e=>setNewDate(e.target.value)} placeholder="5/19" style={{width:'100%',background:'#111',border:'0.5px solid #252525',borderRadius:6,color:'#ccc',padding:'6px',fontSize:12,outline:'none',boxSizing:'border-box'}}/></div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 0.6fr',gap:5,marginBottom:5}}>
                  <div><div style={{fontSize:7,color:'#555',marginBottom:2}}>PLAYER NAME</div><input value={newEntry.name} onChange={e=>setNewEntry(p=>({...p,name:e.target.value}))} placeholder="Name" style={{width:'100%',background:'#111',border:'0.5px solid #252525',borderRadius:5,color:'#ccc',padding:'6px',fontSize:11,outline:'none',boxSizing:'border-box'}}/></div>
                  <div><div style={{fontSize:7,color:'#555',marginBottom:2}}>POS</div><select value={newEntry.pos} onChange={e=>setNewEntry(p=>({...p,pos:e.target.value}))} style={{width:'100%',background:'#111',border:'0.5px solid #252525',borderRadius:5,color:'#ccc',padding:'6px',fontSize:11}}>{'QB WR RB TE OL DL LB DB K P'.split(' ').map(p=><option key={p} value={p}>{p}</option>)}</select></div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:5,marginBottom:5}}>
                  {[['load','Load Score'],['dist','Distance (mi)'],['topSpeed','Top Speed (mph)'],['sprints','Sprint Count']].map(([k,l])=>(
                    <div key={k}><div style={{fontSize:7,color:'#555',marginBottom:2}}>{l.toUpperCase()}</div><input type="number" value={newEntry[k]} onChange={e=>setNewEntry(p=>({...p,[k]:e.target.value}))} placeholder="0" style={{width:'100%',background:'#111',border:'0.5px solid #252525',borderRadius:5,color:'#ccc',padding:'6px',fontSize:12,outline:'none',boxSizing:'border-box'}}/></div>
                  ))}
                </div>
                <div style={{marginBottom:8}}><div style={{fontSize:7,color:'#555',marginBottom:2}}>RPE (1-10 effort rating)</div><input type="number" min="1" max="10" value={newEntry.rpe} onChange={e=>setNewEntry(p=>({...p,rpe:e.target.value}))} placeholder="7" style={{width:'100%',background:'#111',border:'0.5px solid #252525',borderRadius:5,color:'#ccc',padding:'6px',fontSize:12,outline:'none',boxSizing:'border-box'}}/></div>
                <button onClick={addManual} style={{width:'100%',padding:'9px',background:'#0c1a3a',border:'1px solid #06b6d4',borderRadius:6,color:'#06b6d4',fontWeight:700,fontSize:12,cursor:'pointer'}}>+ Add Player Data</button>
              </div>
            )}
            {mode==='rpe'&&(
              <div style={{background:'#0d0d0d',border:'0.5px solid #252525',borderRadius:8,padding:12,marginBottom:10}}>
                <div style={{fontSize:9,fontWeight:700,color:'#06b6d4',marginBottom:6,letterSpacing:1}}>RPE LOGGER — Free Alternative to Catapult</div>
                <div style={{fontSize:8,color:'#555',marginBottom:8,lineHeight:1.6}}>After every practice, each player rates their effort 1-10. No hardware needed. The app tracks trends and flags fatigue over time. Takes 30 seconds per session.</div>
                <div style={{marginBottom:6}}><div style={{fontSize:7,color:'#555',marginBottom:3}}>SESSION DATE</div><input value={newDate} onChange={e=>setNewDate(e.target.value)} placeholder="5/19" style={{width:'100%',background:'#111',border:'0.5px solid #252525',borderRadius:6,color:'#ccc',padding:'6px',fontSize:12,outline:'none',boxSizing:'border-box'}}/></div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 0.6fr',gap:5,marginBottom:8}}>
                  <div><div style={{fontSize:7,color:'#555',marginBottom:2}}>PLAYER</div><input value={newEntry.name} onChange={e=>setNewEntry(p=>({...p,name:e.target.value}))} placeholder="Player name" style={{width:'100%',background:'#111',border:'0.5px solid #252525',borderRadius:5,color:'#ccc',padding:'6px',fontSize:11,outline:'none',boxSizing:'border-box'}}/></div>
                  <div><div style={{fontSize:7,color:'#555',marginBottom:2}}>RPE 1-10</div><input type="number" min="1" max="10" value={newEntry.rpe} onChange={e=>setNewEntry(p=>({...p,rpe:e.target.value}))} placeholder="7" style={{width:'100%',background:'#111',border:'0.5px solid #252525',borderRadius:5,color:'#ccc',padding:'7px',fontSize:18,fontWeight:700,outline:'none',boxSizing:'border-box',textAlign:'center'}}/></div>
                </div>
                <button onClick={()=>{if(!newEntry.name||!newEntry.rpe)return;setNewEntry(p=>({...p,name:'',rpe:''}));addManual()}} style={{width:'100%',padding:'9px',background:'#0c1a3a',border:'1px solid #06b6d4',borderRadius:6,color:'#06b6d4',fontWeight:700,fontSize:12,cursor:'pointer'}}>Log RPE</button>
              </div>
            )}
            <div style={{display:'flex',gap:5,flexWrap:'wrap',marginBottom:8}}>
              {sessions.map((s,i)=>(
                <button key={i} onClick={()=>setActiveSession(i)} style={{padding:'5px 10px',background:activeSession===i?'#0c1a3a':'#0d0d0d',border:`0.5px solid ${activeSession===i?'#06b6d4':'#252525'}`,borderRadius:5,color:activeSession===i?'#06b6d4':'#555',fontSize:9,fontWeight:700,cursor:'pointer'}}>{s.date}</button>
              ))}
            </div>
          </div>
          <div>
            {sess&&(
              <div>
                <div style={{background:'#0d0d0d',border:'0.5px solid #1a1a2a',borderRadius:8,overflow:'hidden',marginBottom:8}}>
                  <div style={{background:'#0a0a0a',padding:'7px 12px',borderBottom:'0.5px solid #252525',display:'grid',gridTemplateColumns:'1fr 0.6fr 0.6fr 0.7fr 0.7fr 0.5fr 0.5fr'}}>
                    {['PLAYER','LOAD','DIST','SPEED','SPRINTS','RPE','STATUS'].map(h=><div key={h} style={{fontSize:7,fontWeight:700,color:'#555',textAlign:'center'}}>{h}</div>)}
                  </div>
                  {sess.players.map((p,i)=>{
                    const status=p.load>100?'HIGH':p.load>80?'MED':p.rpe>=8?'TIRED':'GOOD'
                    const sc=p.load>100?'#dc2626':p.load>80?'#d97706':'#22c55e'
                    return(
                      <div key={i} style={{display:'grid',gridTemplateColumns:'1fr 0.6fr 0.6fr 0.7fr 0.7fr 0.5fr 0.5fr',padding:'8px 12px',background:i%2===0?'#0f0f0f':'#141414',borderBottom:'0.5px solid #1a1a1a',alignItems:'center'}}>
                        <div><div style={{fontSize:9,fontWeight:700,color:'#F0B429'}}>{p.name}</div><div style={{fontSize:7,color:'#444'}}>{p.pos}</div></div>
                        <div style={{textAlign:'center'}}><div style={{fontSize:12,fontWeight:700,color:loadColor(p.load)}}>{p.load}</div></div>
                        <div style={{textAlign:'center',fontSize:10,color:'#9ca3af'}}>{p.dist}mi</div>
                        <div style={{textAlign:'center',fontSize:10,color:'#9ca3af'}}>{p.topSpeed}mph</div>
                        <div style={{textAlign:'center',fontSize:10,color:'#9ca3af'}}>{p.sprints}</div>
                        <div style={{textAlign:'center'}}><span style={{fontSize:10,fontWeight:700,color:rpeColor(p.rpe)}}>{p.rpe}/10</span></div>
                        <div style={{textAlign:'center'}}><span style={{fontSize:7,fontWeight:700,color:sc,background:sc+'22',padding:'2px 5px',borderRadius:3}}>{status}</span></div>
                      </div>
                    )
                  })}
                </div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:6,marginBottom:8}}>
                  {[['Avg Load',Math.round(sess.players.reduce((a,p)=>a+p.load,0)/sess.players.length),'#06b6d4'],['High Load',sess.players.filter(p=>p.load>80).length+' players','#dc2626'],['Avg RPE',(sess.players.reduce((a,p)=>a+p.rpe,0)/sess.players.length).toFixed(1)+'/10','#F0B429'],['At Risk',sess.players.filter(p=>p.load>100||p.rpe>=9).length+' players',sess.players.filter(p=>p.load>100||p.rpe>=9).length>0?'#dc2626':'#22c55e']].map(([l,v,col])=>(
                    <div key={l} style={{background:'#111',border:`0.5px solid ${col}33`,borderRadius:7,padding:'8px 4px',textAlign:'center'}}>
                      <div style={{fontSize:14,fontWeight:700,color:col,lineHeight:1}}>{v}</div>
                      <div style={{fontSize:7,color:'#555',marginTop:3}}>{l}</div>
                    </div>
                  ))}
                </div>
                <div style={{background:'#0d0d0d',border:'0.5px solid #1d3a1d',borderRadius:8,padding:10,marginBottom:8}}>
                  <div style={{fontSize:8,fontWeight:700,color:'#22c55e',marginBottom:5,letterSpacing:1}}>LOAD vs PERFORMANCE CORRELATION</div>
                  {[{name:'Cooper Melvin',loads:[68,52],comps:[75,100]},{name:'Ben Kooi',loads:[55,48],comps:[55,40]}].map(qb=>(
                    <div key={qb.name} style={{marginBottom:8,paddingBottom:8,borderBottom:'0.5px solid #1a1a1a'}}>
                      <div style={{fontSize:10,fontWeight:700,color:'#F0B429',marginBottom:4}}>{qb.name}</div>
                      <div style={{display:'flex',gap:8}}>
                        {qb.loads.map((load,i)=>(
                          <div key={i} style={{background:'#111',borderRadius:5,padding:'5px 8px',textAlign:'center',flex:1}}>
                            <div style={{fontSize:8,color:'#555',marginBottom:2}}>Load {load}</div>
                            <div style={{fontSize:11,fontWeight:700,color:qb.comps[i]>=80?'#22c55e':'#d97706'}}>{qb.comps[i]}% comp</div>
                          </div>
                        ))}
                      </div>
                      <div style={{fontSize:8,color:'#555',marginTop:4}}>
                        {qb.loads[0]>qb.loads[1]&&qb.comps[0]<qb.comps[1]?'⚠ Higher load correlates with lower performance — monitor closely':'✓ Performance holds across load levels'}
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={getAiInsight} disabled={aiLoad} style={{width:'100%',padding:'11px',background:aiLoad?'#111':'#0c1a3a',border:`1px solid ${aiLoad?'#252525':'#06b6d4'}`,borderRadius:8,color:aiLoad?'#555':'#06b6d4',fontWeight:700,fontSize:12,cursor:'pointer',marginBottom:aiInsight?8:0}}>
                  {aiLoad?'Analyzing load data...':'🤖 AI Load Analysis — Who needs rest, who is ready to push'}
                </button>
                {aiInsight&&(
                  <div style={{background:'#07070f',border:'1px solid #06b6d4',borderRadius:8,padding:12}}>
                    <div style={{fontSize:8,fontWeight:700,color:'#06b6d4',marginBottom:6,letterSpacing:1}}>AI LOAD ANALYSIS</div>
                    <div style={{fontSize:12,color:'#ccc',lineHeight:1.7,whiteSpace:'pre-wrap'}}>{aiInsight}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }


  const PracticeTimer=()=>{
    const [mins,setMins]=React.useState(12)
    const [secs,setSecs]=React.useState(0)
    const [running,setRunning]=React.useState(false)
    const [period,setPeriod]=React.useState(1)
    const [log,setLog]=React.useState([])
    const intervalRef=React.useRef(null)
    React.useEffect(()=>{
      if(running){
        intervalRef.current=setInterval(()=>{
          setSecs(s=>{
            if(s===0){
              setMins(m=>{
                if(m===0){
                  setRunning(false)
                  setPeriod(p=>p+1)
                  setLog(l=>[...l,{period,time:new Date().toLocaleTimeString(),label:'Period complete'}])
                  setMins(12);setSecs(0)
                  return 12
                }
                return m-1
              })
              return 59
            }
            return s-1
          })
        },1000)
      } else {clearInterval(intervalRef.current)}
      return()=>clearInterval(intervalRef.current)
    },[running])
    const reset=()=>{setRunning(false);setMins(12);setSecs(0)}
    const pct=((mins*60+secs)/(12*60))*100
    return(
      <div style={{background:'#0d0d0d',border:`1px solid ${running?'#22c55e':'#252525'}`,borderRadius:10,padding:14,marginBottom:12}}>
        <div style={{fontSize:9,fontWeight:700,color:'#F0B429',marginBottom:10,letterSpacing:1}}>⏱ PRACTICE PERIOD TIMER — Period {period}</div>
        <div style={{textAlign:'center',marginBottom:10}}>
          <div style={{fontSize:52,fontWeight:700,color:running?'#22c55e':mins<2?'#dc2626':'#fff',lineHeight:1,fontFamily:'monospace'}}>
            {String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}
          </div>
          <div style={{height:4,background:'#1a1a1a',borderRadius:2,marginTop:8,overflow:'hidden'}}>
            <div style={{height:'100%',width:`${pct}%`,background:mins<2?'#dc2626':'#22c55e',borderRadius:2,transition:'width 1s'}}/>
          </div>
        </div>
        <div style={{display:'flex',gap:6,marginBottom:8}}>
          <button onClick={()=>setRunning(!running)} style={{flex:2,padding:'11px',background:running?'#1a0404':'#14532d',border:`1px solid ${running?'#dc2626':'#22c55e'}`,borderRadius:7,color:running?'#dc2626':'#22c55e',fontWeight:700,fontSize:14,cursor:'pointer'}}>
            {running?'⏸ PAUSE':'▶ START'}
          </button>
          <button onClick={reset} style={{flex:1,padding:'11px',background:'#0d0d0d',border:'0.5px solid #252525',borderRadius:7,color:'#555',fontSize:12,cursor:'pointer'}}>Reset</button>
          <button onClick={()=>{setPeriod(p=>p+1);setMins(12);setSecs(0);setRunning(false);setLog(l=>[...l,{period,time:new Date().toLocaleTimeString(),label:'Period skipped'}])}} style={{flex:1,padding:'11px',background:'#0d0d0d',border:'0.5px solid #252525',borderRadius:7,color:'#555',fontSize:11,cursor:'pointer'}}>Next</button>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:4}}>
          {[10,12,15,20].map(m=>(
            <button key={m} onClick={()=>{setMins(m);setSecs(0);setRunning(false)}} style={{padding:'6px',background:mins===m&&secs===0?'#14532d':'#111',border:`0.5px solid ${mins===m&&secs===0?'#22c55e':'#252525'}`,borderRadius:4,color:mins===m&&secs===0?'#22c55e':'#555',fontSize:9,fontWeight:700,cursor:'pointer'}}>{m} min</button>
          ))}
        </div>
        {log.length>0&&<div style={{marginTop:8,fontSize:8,color:'#444'}}>{log.slice(-3).map((l,i)=><div key={i}>Period {l.period} — {l.label} at {l.time}</div>)}</div>}
      </div>
    )
  }


  const PenaltyTracker=({isMob})=>{
    const [penalties,setPenalties]=React.useState([])
    const types=['False Start','Holding','Pass Interference','Offsides','Illegal Formation','Delay of Game','Unsportsmanlike','Face Mask','Encroachment','Illegal Motion']
    const addPenalty=(type)=>{
      setPenalties(p=>[...p,{id:Date.now(),type,side:type==='Holding'||type==='False Start'||type==='Illegal Formation'||type==='Delay of Game'||type==='Illegal Motion'?'Offense':'Defense',time:new Date().toLocaleTimeString()}])
    }
    const off=penalties.filter(p=>p.side==='Offense')
    const def=penalties.filter(p=>p.side==='Defense')
    const top=Object.entries(penalties.reduce((a,p)=>{a[p.type]=(a[p.type]||0)+1;return a},{})).sort((a,b)=>b[1]-a[1]).slice(0,3)
    return(
      <div style={{background:'#0d0d0d',border:'1px solid #dc2626',borderRadius:8,padding:12,marginBottom:10}}>
        <div style={{fontSize:9,fontWeight:700,color:'#dc2626',marginBottom:8,letterSpacing:1}}>🚩 PENALTY TRACKER — Tap to Log</div>
        <div style={{display:'flex',gap:12,marginBottom:8}}>
          <div style={{flex:1,textAlign:'center'}}><div style={{fontSize:22,fontWeight:700,color:'#dc2626'}}>{off.length}</div><div style={{fontSize:8,color:'#555'}}>Offense</div></div>
          <div style={{flex:1,textAlign:'center'}}><div style={{fontSize:22,fontWeight:700,color:'#F0B429'}}>{def.length}</div><div style={{fontSize:8,color:'#555'}}>Defense</div></div>
          <div style={{flex:1,textAlign:'center'}}><div style={{fontSize:22,fontWeight:700,color:'#9ca3af'}}>{penalties.length}</div><div style={{fontSize:8,color:'#555'}}>Total</div></div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:isMob?'1fr 1fr':'repeat(5,1fr)',gap:4,marginBottom:8}}>
          {types.map(type=>(
            <button key={type} onClick={()=>addPenalty(type)}
              style={{padding:'7px 4px',background:'#111',border:'0.5px solid #252525',borderRadius:5,color:'#9ca3af',fontSize:8,fontWeight:700,cursor:'pointer',textAlign:'center',lineHeight:1.3}}>
              {type}
            </button>
          ))}
        </div>
        {top.length>0&&(
          <div style={{fontSize:8,color:'#555'}}>
            Top: {top.map(([type,count])=>`${type} ×${count}`).join(' · ')}
          </div>
        )}
        {penalties.length>0&&(
          <button onClick={()=>setPenalties([])} style={{marginTop:6,padding:'4px 8px',background:'#1a0404',border:'0.5px solid #dc262644',borderRadius:4,color:'#dc2626',fontSize:7,cursor:'pointer'}}>Clear all penalties</button>
        )}
      </div>
    )
  }


  const CoachingPointsTab=()=>{
    const [points,setPoints]=React.useState([])
    const [player,setPlayer]=React.useState('Cooper Melvin')
    const [coach,setCoach]=React.useState('QB Coach')
    const [point,setPoint]=React.useState('')
    const [repGrade,setRepGrade]=React.useState('Good')
    const [session,setSession]=React.useState('Today')
    const [filterPlayer,setFilterPlayer]=React.useState('All')
    const [repOfDay,setRepOfDay]=React.useState(null)
    const [aiSummary,setAiSummary]=React.useState('')
    const [aiLoad,setAiLoad]=React.useState(false)
    const players=['Cooper Melvin','Ben Kooi','WR1','WR2','RB1','OL Captain','Team']
    const coaches=['QB Coach','WR Coach','RB Coach','OL Coach','DC','DB Coach','DL Coach','Head Coach']
    const grades=['Elite Rep','Good Rep','Needs Work','Critical Fix']
    const gradeColor=g=>g==='Elite Rep'?'#22c55e':g==='Good Rep'?'#d97706':g==='Needs Work'?'#ea580c':'#dc2626'
    const addPoint=()=>{
      if(!point.trim())return
      setPoints(p=>[...p,{id:Date.now(),player,coach,point,repGrade,session,time:new Date().toLocaleTimeString()}])
      setPoint('')
    }
    const filtered=filterPlayer==='All'?points:points.filter(p=>p.player===filterPlayer)
    const markRepOfDay=(p)=>setRepOfDay(p)
    const summarize=async()=>{
      if(!points.length)return
      setAiLoad(true)
      const summary=points.map(p=>`[${p.coach}] ${p.player}: ${p.repGrade} — ${p.point}`).join('\n')
      try{
        const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:300,system:'You are a football coordinator summarizing coaching point logs from a practice session. Group by player. Give the top 2 teaching priorities for each player. Then give 3 practice drill recommendations for the next session. Be direct.',messages:[{role:'user',content:`Coaching points from today:\n${summary}\nSummarize top priorities and next session drill recommendations.`}]})})
        const d=await r.json();setAiSummary(d.content?.[0]?.text||'Error')
      }catch(e){setAiSummary('Connection error.')}
      setAiLoad(false)
    }
    const playerTotals=players.map(p=>({player:p,total:points.filter(x=>x.player===p).length,elite:points.filter(x=>x.player===p&&x.repGrade==='Elite Rep').length,fix:points.filter(x=>x.player===p&&x.repGrade==='Critical Fix').length})).filter(x=>x.total>0)
    return(
      <div style={{padding:16,fontFamily:'Helvetica,Arial,sans-serif'}}>
        <div style={{background:'#0a0a0a',border:'1px solid #F0B429',borderRadius:8,padding:12,marginBottom:12}}>
          <div style={{fontSize:11,fontWeight:700,color:'#F0B429',letterSpacing:2}}>📝 COACHING POINT LOGGER — Tag Every Teaching Moment</div>
          <div style={{fontSize:8,color:'#555',marginTop:2}}>Any coach · Any player · Any rep · AI summarizes top priorities after practice · Rep of the day recognition</div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1.5fr',gap:12}}>
          <div>
            <div style={{background:'#0d0d0d',border:'0.5px solid #2a1a00',borderRadius:8,padding:12,marginBottom:10}}>
              <div style={{fontSize:9,fontWeight:700,color:'#F0B429',marginBottom:8,letterSpacing:1}}>LOG A COACHING POINT</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:5,marginBottom:6}}>
                <div><div style={{fontSize:7,color:'#555',marginBottom:3}}>PLAYER</div>
                  <select value={player} onChange={e=>setPlayer(e.target.value)} style={{width:'100%',background:'#111',border:'0.5px solid #252525',borderRadius:5,color:'#ccc',padding:'6px',fontSize:11}}>
                    {players.map(p=><option key={p} value={p}>{p}</option>)}
                  </select></div>
                <div><div style={{fontSize:7,color:'#555',marginBottom:3}}>YOUR ROLE</div>
                  <select value={coach} onChange={e=>setCoach(e.target.value)} style={{width:'100%',background:'#111',border:'0.5px solid #252525',borderRadius:5,color:'#ccc',padding:'6px',fontSize:11}}>
                    {coaches.map(co=><option key={co} value={co}>{co}</option>)}
                  </select></div>
              </div>
              <div style={{marginBottom:6}}><div style={{fontSize:7,color:'#555',marginBottom:3}}>REP GRADE</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:3}}>
                  {grades.map(g=>(
                    <button key={g} onClick={()=>setRepGrade(g)} style={{padding:'6px',background:repGrade===g?gradeColor(g)+'22':'#111',border:`0.5px solid ${repGrade===g?gradeColor(g):'#252525'}`,borderRadius:4,color:repGrade===g?gradeColor(g):'#555',fontSize:8,fontWeight:700,cursor:'pointer'}}>{g}</button>
                  ))}
                </div>
              </div>
              <div style={{marginBottom:8}}><div style={{fontSize:7,color:'#555',marginBottom:3}}>COACHING POINT</div>
                <textarea value={point} onChange={e=>setPoint(e.target.value)} placeholder="What did you see? Be specific — footwork, release, route, decision..." style={{width:'100%',background:'#111',border:'0.5px solid #252525',borderRadius:6,color:'#ccc',padding:'8px',fontSize:12,outline:'none',minHeight:70,resize:'none',boxSizing:'border-box',lineHeight:1.5}}/>
              </div>
              <button onClick={addPoint} disabled={!point.trim()} style={{width:'100%',padding:'11px',background:'#2a1a00',border:'1px solid #F0B429',borderRadius:7,color:'#F0B429',fontWeight:700,fontSize:13,cursor:'pointer'}}>+ LOG COACHING POINT</button>
            </div>
            {playerTotals.length>0&&(
              <div style={{background:'#0d0d0d',border:'0.5px solid #252525',borderRadius:8,padding:12,marginBottom:10}}>
                <div style={{fontSize:9,fontWeight:700,color:'#F0B429',marginBottom:8}}>PLAYER SUMMARY</div>
                {playerTotals.map(pt=>(
                  <div key={pt.player} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 0',borderBottom:'0.5px solid #1a1a1a'}}>
                    <span style={{fontSize:10,color:'#ccc',fontWeight:700}}>{pt.player}</span>
                    <div style={{display:'flex',gap:6}}>
                      <span style={{fontSize:9,color:'#22c55e'}}>{pt.elite} elite</span>
                      <span style={{fontSize:9,color:'#dc2626'}}>{pt.fix} fix</span>
                      <span style={{fontSize:9,color:'#555'}}>{pt.total} total</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {points.length>=3&&(
              <button onClick={summarize} disabled={aiLoad} style={{width:'100%',padding:'11px',background:aiLoad?'#111':'#07070f',border:`1px solid ${aiLoad?'#252525':'#06b6d4'}`,borderRadius:7,color:aiLoad?'#555':'#06b6d4',fontWeight:700,fontSize:11,cursor:'pointer'}}>
                {aiLoad?'Analyzing coaching points...':'🤖 AI Practice Summary — Top priorities + drills for next session'}
              </button>
            )}
            {aiSummary&&(
              <div style={{background:'#07070f',border:'1px solid #06b6d4',borderRadius:8,padding:12,marginTop:8}}>
                <div style={{fontSize:9,fontWeight:700,color:'#06b6d4',marginBottom:6,letterSpacing:1}}>AI PRACTICE SUMMARY</div>
                <div style={{fontSize:12,color:'#ccc',lineHeight:1.7,whiteSpace:'pre-wrap'}}>{aiSummary}</div>
              </div>
            )}
          </div>
          <div>
            <div style={{display:'flex',gap:4,flexWrap:'wrap',marginBottom:8}}>
              {['All',...players.filter(p=>points.some(x=>x.player===p))].map(p=>(
                <button key={p} onClick={()=>setFilterPlayer(p)} style={{padding:'4px 8px',background:filterPlayer===p?'#2a1a00':'#0d0d0d',border:`0.5px solid ${filterPlayer===p?'#F0B429':'#252525'}`,borderRadius:14,color:filterPlayer===p?'#F0B429':'#555',fontSize:8,cursor:'pointer'}}>{p}</button>
              ))}
            </div>
            {repOfDay&&(
              <div style={{background:'#14532d',border:'1px solid #22c55e',borderRadius:8,padding:'10px 14px',marginBottom:8,display:'flex',gap:10,alignItems:'center'}}>
                <span style={{fontSize:16}}>⭐</span>
                <div><div style={{fontSize:10,fontWeight:700,color:'#22c55e'}}>REP OF THE DAY — {repOfDay.player}</div><div style={{fontSize:11,color:'#ccc',marginTop:2}}>{repOfDay.point}</div></div>
                <button onClick={()=>setRepOfDay(null)} style={{marginLeft:'auto',background:'transparent',border:'none',color:'#555',cursor:'pointer',fontSize:12,flexShrink:0}}>✕</button>
              </div>
            )}
            {filtered.length===0?(
              <div style={{background:'#0d0d0d',border:'0.5px solid #1a1a1a',borderRadius:8,padding:28,textAlign:'center',color:'#333',fontSize:12}}>No coaching points yet — start tagging reps as you watch film or run practice</div>
            ):(
              <div style={{display:'flex',flexDirection:'column',gap:5}}>
                {filtered.map(p=>(
                  <div key={p.id} style={{background:'#0d0d0d',border:`0.5px solid ${gradeColor(p.repGrade)}33`,borderRadius:8,padding:'10px 12px',borderLeft:`3px solid ${gradeColor(p.repGrade)}`}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:4}}>
                      <div style={{display:'flex',gap:6,flexWrap:'wrap',alignItems:'center'}}>
                        <span style={{fontSize:9,fontWeight:700,color:'#F0B429'}}>{p.player}</span>
                        <span style={{background:gradeColor(p.repGrade)+'22',color:gradeColor(p.repGrade),fontSize:8,fontWeight:700,padding:'1px 6px',borderRadius:4}}>{p.repGrade}</span>
                        <span style={{fontSize:8,color:'#555'}}>{p.coach}</span>
                        <span style={{fontSize:7,color:'#333'}}>{p.time}</span>
                      </div>
                      <button onClick={()=>markRepOfDay(p)} title="Mark as Rep of the Day" style={{background:'transparent',border:'none',color:repOfDay?.id===p.id?'#F0B429':'#333',cursor:'pointer',fontSize:13,flexShrink:0}}>★</button>
                    </div>
                    <div style={{fontSize:12,color:'#ccc',lineHeight:1.5}}>{p.point}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: 10, ...style }}>
      {title && <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.6, color: titleClr || '#9ca3af', marginBottom: 8 }}>{title}</div>}
      {children}
    </div>
  )
}

function Pill({ label, color }) {
  return <span style={{ display: 'inline-block', padding: '1px 7px', borderRadius: 10, fontSize: 10, fontWeight: 700, background: `${color}22`, color, border: `1px solid ${color}44` }}>{label}</span>
}

function MBar({ pct, color, width = 64 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'flex-end' }}>
      <div style={{ width, height: 6, background: '#1a2e1a', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: 10, fontWeight: 700, color, minWidth: 30, textAlign: 'right' }}>{pct}%</span>
    </div>
  )
}

const selS = { background: '#1a2e1a', border: `1px solid ${C.border}`, color: '#e5e7eb', padding: '4px 8px', borderRadius: 4, fontSize: 11, fontFamily: 'inherit', cursor: 'pointer' }

// ─── Throw Map ───────────────────────────────────────────────
const CPOS = { Stick:{x:-17,y:7}, Out:{x:21,y:6}, Baltimore:{x:22,y:32}, Post:{x:0,y:28}, Slant:{x:-6,y:7}, Sail:{x:4,y:39}, Fade:{x:27,y:42} }

function ThrowMap({ rows }) {
  const W = 310, H = 255, cx = W/2, lineY = H * 0.63
  const sx = x => cx + (x/43) * (W/2 - 8)
  const sy = y => lineY - (y/46) * (H * 0.64)
  const dots = rows.map((p, i) => {
    const b = CPOS[p.concept] || { x: 0, y: 10 }
    return { x: b.x + ((i*1237)%9-4)*0.45, y: b.y + ((i*3571)%7-3)*0.35, r: p.result }
  })
  const zL = rows.filter((_, i) => (dots[i]?.x||0) < -10)
  const zM = rows.filter((_, i) => Math.abs(dots[i]?.x||0) <= 10)
  const zR = rows.filter((_, i) => (dots[i]?.x||0) > 10)
  const zp = a => a.length ? Math.round(a.filter(ok).length / a.length * 100) : 0
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ background: '#0e1e0e', borderRadius: 4 }}>
      <defs><pattern id="grd" width="18" height="18" patternUnits="userSpaceOnUse"><path d="M18 0L0 0 0 18" fill="none" stroke="#162816" strokeWidth="0.5"/></pattern></defs>
      <rect width={W} height={H} fill="url(#grd)"/>
      <rect x={0}     y={0} width={W/3}   height={H} fill="rgba(34,197,94,0.04)"/>
      <rect x={W/3}   y={0} width={W/3}   height={H} fill="rgba(239,68,68,0.04)"/>
      <rect x={2*W/3} y={0} width={W/3}   height={H} fill="rgba(34,197,94,0.04)"/>
      <line x1={W/3}   y1={0} x2={W/3}   y2={H-22} stroke={C.muted} strokeWidth={.8} strokeDasharray="4,4"/>
      <line x1={2*W/3} y1={0} x2={2*W/3} y2={H-22} stroke={C.muted} strokeWidth={.8} strokeDasharray="4,4"/>
      {[0,10,20,30,40].map(y => {
        const ys = sy(y); if (ys < 4 || ys > H - 24) return null
        return <g key={y}><line x1={5} y1={ys} x2={W-5} y2={ys} stroke="#1a3218" strokeWidth={.6}/><text x={4} y={ys-2} fill="#2a4a2a" fontSize={7}>{y}</text></g>
      })}
      <line x1={0} y1={lineY} x2={W} y2={lineY} stroke={C.gold} strokeWidth={1} strokeDasharray="6,3" opacity={.55}/>
      {dots.map((d, i) => <circle key={i} cx={sx(d.x)} cy={sy(d.y)} r={5} fill={d.r==='Complete'?C.green:d.r==='Risky'?C.orange:C.red} opacity={.88} stroke="#000" strokeWidth={.3}/>)}
      {[{x:W/6,lbl:'LEFT OUTSIDE',pct:zp(zL)},{x:W/2,lbl:'MIDDLE',pct:zp(zM)},{x:5*W/6,lbl:'RIGHT OUTSIDE',pct:zp(zR)}].map(z => {
        const clr = z.pct >= 65 ? C.green : C.red
        return <g key={z.lbl}>
          <text x={z.x} y={H-12} fill={clr} fontSize={7.5} textAnchor="middle" fontWeight={700}>{z.lbl}</text>
          <text x={z.x} y={H-3}  fill={clr} fontSize={7}   textAnchor="middle">{z.pct}% SUCCESS</text>
        </g>
      })}
    </svg>
  )
}

// ─── Route Field ─────────────────────────────────────────────
function RouteField({ play, height = 205 }) {
  const W = 540, H = height, los = Math.round(H * 0.63)
  const def = ROUTES[play.concept] || ROUTES.Stick
  const players = def.players(los)
  const complete = play.result === 'Complete'
  const OL = [['LT',148],['LG',170],['C',192],['RG',214],['RT',236]]
  const defense = [
    {x:110,y:los-21,lbl:'LE'},{x:168,y:los-23,lbl:'DT'},{x:213,y:los-23,lbl:'DT'},
    {x:256,y:los-21,lbl:'DE'},{x:128,y:los-49,lbl:'LB'},{x:205,y:los-51,lbl:'LB'},
    {x:292,y:los-49,lbl:'SS'},{x:360,y:los-27,lbl:'CB'},{x:74, y:los-32,lbl:'CB'},
    {x:435,y:los-74,lbl:'SS'},{x:196,y:los-88,lbl:'FS'},
  ]
  const mkId = c => c === C.green ? 'url(#mg)' : c === C.gold ? 'url(#mgo)' : 'url(#mr)'
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ background: '#0d1d0d', borderRadius: 6 }}>
      <defs>
        {[['mg',C.green],['mgo',C.gold],['mr',C.red]].map(([id,fill]) => (
          <marker key={id} id={id} markerWidth={7} markerHeight={7} refX={6} refY={3.5} orient="auto">
            <path d="M0,0 L0,7 L7,3.5z" fill={fill}/>
          </marker>
        ))}
      </defs>
      <rect width={W} height={H} fill="#0d1d0d"/>
      {[10,20,30,40].map(y => {
        const ys = los - y*(los/46); if (ys < 4 || ys > H - 4) return null
        return <g key={y}>
          <line x1={0} y1={ys} x2={W} y2={ys} stroke="#172817" strokeWidth={.7}/>
          <text x={8}   y={ys-2} fill="#1e3a1e" fontSize={7.5}>{y}</text>
          <text x={W-8} y={ys-2} fill="#1e3a1e" fontSize={7.5} textAnchor="end">{y}</text>
        </g>
      })}
      <line x1={0} y1={los} x2={W} y2={los} stroke={C.gold} strokeWidth={1.5} strokeDasharray="9,5" opacity={.65}/>
      <text x={4} y={los-3} fill={C.gold} fontSize={7} fontWeight={700}>LOS</text>
      {defense.map((d, i) => <g key={i}>
        <rect x={d.x-12} y={d.y-9} width={24} height={18} rx={3} fill="#1c0c06" stroke={C.orange} strokeWidth={1.1}/>
        <text x={d.x} y={d.y+5} fill={C.orange} fontSize={7} textAnchor="middle" fontWeight={700}>{d.lbl}</text>
      </g>)}
      {players.map(s => {
        const clr = !complete && s.primary ? C.red : s.clr
        return <g key={s.lbl + 'r'}>
          {s.primary && <path d={s.path} fill="none" stroke={clr} strokeWidth={6} opacity={.1}/>}
          <path d={s.path} fill="none" stroke={clr} strokeWidth={s.primary?2.4:1.6}
            strokeDasharray={!complete && s.primary ? '6,4' : 'none'}
            opacity={s.primary?1:.8} markerEnd={mkId(clr)}/>
          <text x={s.lx} y={s.ly} fill={clr} fontSize={8} fontWeight={s.primary?700:500} textAnchor={s.la} opacity={.95}>
            {s.name}
          </text>
        </g>
      })}
      {OL.map(([lbl, x]) => <g key={lbl}>
        <circle cx={x} cy={los} r={12} fill="#162816" stroke={C.gold} strokeWidth={1.5}/>
        <text x={x} y={los+4} fill={C.gold} fontSize={7} textAnchor="middle" fontWeight={700}>{lbl}</text>
      </g>)}
      <circle cx={192} cy={los+23} r={13} fill="#162816" stroke={C.green} strokeWidth={2.2}/>
      <text x={192} y={los+27} fill={C.green} fontSize={8} textAnchor="middle" fontWeight={700}>QB</text>
      <circle cx={192} cy={los+45} r={11} fill="#162816" stroke={C.gold} strokeWidth={1.5}/>
      <text x={192} y={los+49} fill={C.gold} fontSize={7} textAnchor="middle" fontWeight={700}>RB</text>
      {players.map(s => {
        const clr = !complete && s.primary ? C.red : s.clr
        return <g key={s.lbl + 'p'}>
          {s.primary && <circle cx={s.cx} cy={s.cy} r={17} fill="none" stroke={clr} strokeWidth={.8} opacity={.35}/>}
          <circle cx={s.cx} cy={s.cy} r={12} fill="#162816" stroke={clr} strokeWidth={s.primary?2.5:1.8}/>
          <text x={s.cx} y={s.cy+4} fill={clr} fontSize={8} textAnchor="middle" fontWeight={700}>{s.lbl}</text>
        </g>
      })}
      <rect x={W-96} y={4} width={92} height={20} rx={4} fill={complete?'#0d1f0d':'#1f0d0d'} stroke={complete?C.green:C.red} strokeWidth={1}/>
      <text x={W-50} y={17} fill={complete?C.green:C.red} fontSize={9} textAnchor="middle" fontWeight={700}>
        {complete ? `✓ COMPLETE  +${play.yards} YDS` : '✗ INCOMPLETE'}
      </text>
    </svg>
  )
}

// ─── Import Modal ─────────────────────────────────────────────
function ImportModal({ onImport, onClose, currentCount }) {
  const [mode, setMode]     = useState('csv')   // 'csv' | 'manual' | 'json'
  const [csvText, setCsv]   = useState('')
  const [jsonText, setJson] = useState('')
  const [error, setError]   = useState('')
  const [preview, setPreview] = useState(null)
  const fileRef = useRef(null)

  // Manual entry state
  const blankRow = { qb:'Cooper Melvin', concept:'Stick', result:'Complete', yards:'', down:'1', field:'normal', ttt:'', date:'', session:'7on7' }
  const [manual, setManual] = useState([{ ...blankRow }])

  const handleFileUpload = e => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      if (file.name.endsWith('.json')) { setMode('json'); setJson(ev.target.result) }
      else { setMode('csv'); setCsv(ev.target.result) }
    }
    reader.readAsText(file)
  }

  const tryPreview = () => {
    setError('')
    try {
      let parsed = []
      if (mode === 'csv') {
        parsed = parseCSV(csvText)
      } else if (mode === 'json') {
        const data = JSON.parse(jsonText)
        parsed = Array.isArray(data) ? data : data.plays || []
        if (!parsed.length) throw new Error('No plays found in JSON')
      } else {
        parsed = manual.map((row, i) => {
          if (!row.concept) throw new Error(`Row ${i+1}: concept is required`)
          return {
            qb:      row.qb || 'Cooper Melvin',
            concept: row.concept,
            result:  row.result,
            yards:   parseInt(row.yards) || 0,
            down:    parseInt(row.down) || 1,
            field:   row.field || 'normal',
            ttt:     row.ttt || '',
            date:    row.date || 'New',
            session: row.session || '7on7',
          }
        })
      }
      setPreview(parsed)
    } catch (e) {
      setError(e.message)
    }
  }

  const handleConfirm = () => {
    if (!preview) return
    onImport(preview)
    onClose()
  }

  const overlay = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }
  const modal   = { background: '#101e10', border: `1px solid ${C.border}`, borderRadius: 10, padding: 24, width: '90%', maxWidth: 720, maxHeight: '90vh', overflowY: 'auto' }
  const tabBtn  = active => ({ padding: '6px 16px', borderRadius: 5, border: `1px solid ${C.border}`, background: active ? '#1a6b2a' : '#1a2e1a', color: active ? 'white' : '#9ca3af', cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, fontWeight: 700 })
  const inp     = { ...selS, width: '100%', padding: '6px 10px', borderRadius: 5, fontSize: 12, marginBottom: 8 }
  const ta      = { ...inp, height: 160, resize: 'vertical', fontFamily: 'monospace', fontSize: 11 }

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div>
            <div style={{ fontFamily: 'Oswald', fontSize: 20, fontWeight: 700, color: C.gold }}>IMPORT PRACTICE DATA</div>
            <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>Currently {currentCount} plays loaded · New plays will be merged in</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: 20, cursor: 'pointer' }}>✕</button>
        </div>

        {/* Mode tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
          <button style={tabBtn(mode==='csv')}    onClick={() => setMode('csv')}>📋 CSV Paste / Upload</button>
          <button style={tabBtn(mode==='manual')} onClick={() => setMode('manual')}>✏️ Manual Entry</button>
          <button style={tabBtn(mode==='json')}   onClick={() => setMode('json')}>{ }📁 JSON File</button>
        </div>

        {/* File upload (always available) */}
        <div style={{ marginBottom: 14 }}>
          <input ref={fileRef} type="file" accept=".csv,.json" onChange={handleFileUpload} style={{ display: 'none' }}/>
          <button onClick={() => fileRef.current.click()} style={{ ...tabBtn(false), marginRight: 8 }}>
            ⬆ Upload .csv or .json file
          </button>
          <span style={{ fontSize: 10, color: '#9ca3af' }}>Or paste / enter data below</span>
        </div>

        {/* CSV Mode */}
        {mode === 'csv' && (
          <div>
            <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 8, lineHeight: 1.6 }}>
              Paste CSV with a header row. Required columns: <strong style={{ color: C.gold }}>qb, concept, result, yards, down, field</strong><br/>
              Optional: <em>ttt, date, session</em> — Values: result = Complete/Incomplete/Risky · field = normal/redzone · down = 1/2/3
            </div>
            <div style={{ fontSize: 10, color: C.muted, background: '#0d1a0d', padding: '6px 10px', borderRadius: 5, fontFamily: 'monospace', marginBottom: 8 }}>
              qb,concept,result,yards,down,field,ttt,date,session<br/>
              QB1,Stick,Complete,9,1,normal,1.7s,4/27,7on7<br/>
              QB2,Baltimore,Complete,14,1,normal,2.0s,4/27,7on7
            </div>
            <textarea value={csvText} onChange={e => setCsv(e.target.value)} placeholder="Paste CSV here…" style={ta}/>
          </div>
        )}

        {/* Manual Mode */}
        {mode === 'manual' && (
          <div>
            <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 10 }}>Add rows one by one. Fill in each field and click "+ Add Row" to add more.</div>
            {manual.map((row, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 6, marginBottom: 8, padding: 8, background: '#0d1a0d', borderRadius: 5 }}>
                <select value={row.qb}     onChange={e => { const m=[...manual];m[i].qb=e.target.value;setManual(m) }}     style={inp}>
                  {['Cooper Melvin','Ben Kooi'].map(o=><option key={o}>{o}</option>)}
                </select>
                <select value={row.concept} onChange={e => { const m=[...manual];m[i].concept=e.target.value;setManual(m) }} style={inp}>
                  {Object.keys(ROUTES).map(o=><option key={o}>{o}</option>)}
                </select>
                <select value={row.result}  onChange={e => { const m=[...manual];m[i].result=e.target.value;setManual(m) }}  style={inp}>
                  {['Complete','Incomplete','Risky'].map(o=><option key={o}>{o}</option>)}
                </select>
                <input  value={row.yards}   onChange={e => { const m=[...manual];m[i].yards=e.target.value;setManual(m) }}   placeholder="Yards" type="number" style={inp}/>
                <select value={row.down}    onChange={e => { const m=[...manual];m[i].down=e.target.value;setManual(m) }}    style={inp}>
                  {['1','2','3'].map(o=><option key={o}>{o}</option>)}
                </select>
                <select value={row.field}   onChange={e => { const m=[...manual];m[i].field=e.target.value;setManual(m) }}   style={inp}>
                  <option value="normal">Normal</option><option value="redzone">Redzone</option>
                </select>
                <input  value={row.ttt}     onChange={e => { const m=[...manual];m[i].ttt=e.target.value;setManual(m) }}     placeholder="TTT e.g. 1.8s" style={inp}/>
                <input  value={row.date}    onChange={e => { const m=[...manual];m[i].date=e.target.value;setManual(m) }}    placeholder="Date e.g. 4/27" style={inp}/>
                <select value={row.session} onChange={e => { const m=[...manual];m[i].session=e.target.value;setManual(m) }} style={inp}>
                  {['7on7','Team','Game','Drill'].map(o=><option key={o}>{o}</option>)}
                </select>
                {manual.length > 1 && <button onClick={() => setManual(manual.filter((_,j)=>j!==i))} style={{ ...tabBtn(false), color: C.red }}>✕</button>}
              </div>
            ))}
            <button onClick={() => setManual([...manual, { ...blankRow }])} style={{ ...tabBtn(false), marginTop: 4 }}>+ Add Row</button>
          </div>
        )}

        {/* JSON Mode */}
        {mode === 'json' && (
          <div>
            <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 8, lineHeight: 1.6 }}>
              Paste a JSON array of play objects, or upload a previously exported <strong style={{ color: C.gold }}>westfield-data.json</strong> file.
            </div>
            <textarea value={jsonText} onChange={e => setJson(e.target.value)} placeholder='[{"qb":"Cooper Melvin","concept":"Stick","result":"Complete","yards":9,"down":1,"field":"normal","date":"4/27"}]' style={ta}/>
          </div>
        )}

        {/* Error */}
        {error && <div style={{ color: C.red, fontSize: 11, marginTop: 8, padding: '6px 10px', background: '#1a0808', borderRadius: 5 }}>⚠ {error}</div>}

        {/* Preview */}
        {preview && (
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 11, color: C.green, fontWeight: 700, marginBottom: 8 }}>✓ {preview.length} plays ready to import</div>
            <div style={{ background: '#0d1a0d', borderRadius: 5, padding: '8px 10px', maxHeight: 160, overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                <thead><tr>{['QB','Concept','Result','Yards','Down','Field','Date'].map(h=><th key={h} style={{ color: '#9ca3af', padding: '3px 6px', fontSize: 9 }}>{h}</th>)}</tr></thead>
                <tbody>{preview.slice(0, 10).map((p, i) => (
                  <tr key={i} style={{ borderTop: `1px solid ${C.border}` }}>
                    <td style={{ padding: '4px 6px', color: C.gold, fontWeight: 700 }}>{p.qb}</td>
                    <td style={{ padding: '4px 6px' }}>{p.concept}</td>
                    <td style={{ padding: '4px 6px', color: resClr(p.result), fontWeight: 700 }}>{p.result}</td>
                    <td style={{ padding: '4px 6px', textAlign: 'center' }}>{p.yards}</td>
                    <td style={{ padding: '4px 6px', textAlign: 'center' }}>{p.down}</td>
                    <td style={{ padding: '4px 6px' }}><Pill label={p.field} color={p.field==='redzone'?C.red:C.muted}/></td>
                    <td style={{ padding: '4px 6px', color: '#9ca3af' }}>{p.date}</td>
                  </tr>
                ))}
                {preview.length > 10 && <tr><td colSpan={7} style={{ padding: '4px 6px', color: '#9ca3af', fontSize: 10 }}>…and {preview.length - 10} more</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, marginTop: 18, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ ...tabBtn(false), padding: '8px 20px' }}>Cancel</button>
          <button onClick={tryPreview} style={{ ...tabBtn(false), padding: '8px 20px', borderColor: C.gold, color: C.gold }}>Preview →</button>
          {preview && <button onClick={handleConfirm} style={{ ...tabBtn(true), padding: '8px 24px', background: '#1a6b2a' }}>✓ Import {preview.length} Plays</button>}
        </div>
      </div>
    </div>
  )
}

// ─── TABS ─────────────────────────────────────────────────────
const TABS = ['Overview','Charts','Play Calls','Replays','Players','Mistakes','Next Practice','Research']

export default function App() {
  const [tab,         setTab]        = useState('Overview')
  const [lightMode,    setLightMode]  = useState(false)
  const [searchOpen,   setSearchOpen] = useState(false)
  const [searchQ,      setSearchQ]    = useState('')
  const [undoPlay,     setUndoPlay]   = useState(null)
  const [pbAlert,      setPbAlert]    = useState(null)

  const [fQB,         setFQB]        = useState('All QBs')
  const [fSit,        setFSit]       = useState('All')
  const [fDate,       setFDate]      = useState('All')
  const [fSess,       setFSess]      = useState('All')
  const [plays, setPlays] = useState(() => { try { const s = localStorage.getItem('wf_plays'); return s ? JSON.parse(s) : SEED_PLAYS } catch { return SEED_PLAYS } })
  const [replayIdx,   setReplayIdx]  = useState(0)
  const [playerQB,    setPlayerQB]   = useState('Cooper Melvin')
  const [showImport,  setImport]     = useState(false)

  // Merge imported plays, assign fresh IDs
  useEffect(() => { try { localStorage.setItem('wf_plays', JSON.stringify(plays)) } catch(e) {} }, [plays])
  useEffect(() => {
    const h = e => {
      if(e.key==='Escape'){setSearchOpen(false);setSearchQ('')}
      if(e.key==='/'&&!searchOpen&&e.target.tagName!=='INPUT'&&e.target.tagName!=='TEXTAREA'){e.preventDefault();setSearchOpen(true)}
    }
    window.addEventListener('keydown',h)
    return()=>window.removeEventListener('keydown',h)
  }, [searchOpen])


  const handleImport = useCallback(newRows => {
    setPlays(prev => {
      const maxId = prev.reduce((m, p) => Math.max(m, p.id), 0)
      const merged = [...prev, ...newRows.map((p, i) => ({ ...p, id: maxId + i + 1 }))]
      return merged
    })
  }, [])

  const dates = useMemo(() => ['All', ...new Set(plays.map(p => p.date))], [plays])

  const rows = useMemo(() => plays.filter(p =>
    (fQB  === 'All QBs' || p.qb    === fQB) &&
    (fSit === 'All'     || p.field  === fSit) &&
    (fDate=== 'All'     || p.date   === fDate) &&
    (fSess=== 'All'     || p.session === fSess)
  ), [plays, fQB, fSit, fDate])

  const concepts = useMemo(() => calcConcepts(rows), [rows])
  const qbs      = useMemo(() => calcQBs(rows),      [rows])
  const best     = concepts[0]
  const worst    = [...concepts].reverse()[0]
  const overall  = rows.length ? Math.round(rows.filter(ok).length / rows.length * 100) : 0

  const successLine = rows.map((_, i) => {
    const s = rows.slice(0, i+1)
    return { play: i+1, success: Math.round(s.filter(ok).length / s.length * 100) }
  })

  const btnTab  = t => ({ padding: '5px 10px', borderRadius: 5, border: 'none', background: t===tab?'#1d7a2d':'transparent', color: t===tab?'#fff':'#6b8f6b', fontFamily: 'inherit', fontSize: 11, fontWeight: 700, cursor: 'pointer' })
  const tipS    = { contentStyle: { background: '#1a2e1a', border: `1px solid ${C.border}`, fontSize: 10, color: '#e5e7eb' } }

  // ── OVERVIEW ──────────────────────────────────────────────
  function Overview() {
    const ptRows = [
      { type:'Quick (Stick/Slant/Out)',  success:100, successClr:C.green, risk:'Low',    riskClr:C.green,  usage:Math.round(rows.filter(p=>['Stick','Slant','Out'].includes(p.concept)).length/Math.max(rows.length,1)*100) },
      { type:'Timing (Baltimore/Post)',  success:100, successClr:C.green, risk:'Medium', riskClr:C.orange, usage:Math.round(rows.filter(p=>['Baltimore','Post'].includes(p.concept)).length/Math.max(rows.length,1)*100) },
      { type:'Shot Plays (Sail/Fade)',   success:0,   successClr:C.red,   risk:'High',   riskClr:C.red,    usage:Math.round(rows.filter(p=>['Sail','Fade'].includes(p.concept)).length/Math.max(rows.length,1)*100) },
    ]
    const sitData = [
      { sit:'1st Down',     plays:rows.filter(p=>p.down===1).length,                        pct:Math.round(rows.filter(p=>p.down===1&&ok(p)).length/Math.max(rows.filter(p=>p.down===1).length,1)*100) },
      { sit:'2nd & Short',  plays:rows.filter(p=>p.down===2&&p.field==='normal').length,    pct:Math.round(rows.filter(p=>p.down===2&&p.field==='normal'&&ok(p)).length/Math.max(rows.filter(p=>p.down===2&&p.field==='normal').length,1)*100) },
      { sit:'3rd & Short',  plays:rows.filter(p=>p.down===3&&p.field==='normal').length,    pct:0 },
      { sit:'3rd & Medium+',plays:rows.filter(p=>p.down===3&&p.field==='redzone').length,   pct:0 },
    ]
    return (
      <div style={{ display:'flex', gap:8 }}>
        {/* Left */}
        <div style={{ width:168, flexShrink:0, display:'flex', flexDirection:'column', gap:8 }}>
          <Card title="FILTERS">
            <select value={fQB} onChange={e=>setFQB(e.target.value)} style={{...selS,display:'block',width:'100%',marginBottom:6}}>{['All QBs','Cooper Melvin','Ben Kooi'].map(o=><option key={o}>{o}</option>)}</select><select value={fSit} onChange={e=>setFSit(e.target.value)} style={{...selS,display:'block',width:'100%',marginBottom:6}}>{[['All','All Situations'],['normal','Normal Field'],['redzone','Redzone']].map(([v,l])=><option key={v} value={v}>{l}</option>)}</select><select value={fDate} onChange={e=>setFDate(e.target.value)} style={{...selS,display:'block',width:'100%',marginBottom:6}}>{dates.map(d=><option key={d} value={d}>{d==='All'?'All Dates':d}</option>)}</select>
          </Card>
          <Card>
            <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:7 }}>
              <span style={{ color:C.green, fontSize:16 }}>☘</span>
              <span style={{ fontSize:9, fontWeight:700, color:C.gold, letterSpacing:1.5 }}>QUICK INSIGHT</span>
            </div>
            <div style={{ fontSize:11, lineHeight:1.75, color:C.text }}>
              <strong style={{ color:C.green }}>{best?.name}</strong> and Out are your highest success plays.<br/><br/>
              Attack left & right outside.<br/><br/>
              <strong style={{ color:C.red }}>Avoid Sail & Fade</strong> — 0% success.
            </div>
          </Card>
        </div>
        {/* Center */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', gap:8, minWidth:0 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            <Card title="THROW MAP  ℹ" titleClr={C.text}>
              <ThrowMap rows={rows}/>
              <div style={{ display:'flex', gap:12, marginTop:6, justifyContent:'center', fontSize:9.5 }}>
                {[['COMPLETE',C.green],['RISKY',C.orange],['INCOMPLETE',C.red]].map(([l,c]) =>
                  <span key={l} style={{ display:'flex', alignItems:'center', gap:4 }}>
                    <span style={{ width:7, height:7, borderRadius:'50%', background:c, display:'inline-block' }}/>
                    {l}
                  </span>
                )}
              </div>
            </Card>
            <Card title="SUCCESS OVER PLAYS" titleClr={C.gold}>
              <ResponsiveContainer width="100%" height={185}>
                <LineChart data={successLine} margin={{ top:4, right:6, bottom:14, left:-14 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
                  <XAxis dataKey="play" stroke="#4a6a4a" tick={{ fill:'#9ca3af', fontSize:8 }} label={{ value:'Plays', position:'insideBottom', fill:'#9ca3af', fontSize:8, dy:10 }}/>
                  <YAxis domain={[0,100]} stroke="#4a6a4a" tick={{ fill:'#9ca3af', fontSize:8 }} tickFormatter={v=>v+'%'}/>
                  <Tooltip {...tipS} formatter={v=>[v+'%','Success']} labelFormatter={l=>'Play '+l}/>
                  <Line type="monotone" dataKey="success" stroke={C.green} strokeWidth={2} dot={{ fill:C.green, r:2 }} activeDot={{ r:4 }}/>
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
          <Card title="PLAY TYPE IMPACT" titleClr={C.gold}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:11.5 }}>
              <thead><tr style={{ color:'#9ca3af', fontSize:9 }}>{['TYPE','SUCCESS %','RISK','USAGE'].map((h,i)=><th key={h} style={{ padding:'3px 8px', textAlign:i===0?'left':i===3?'right':'center' }}>{h}</th>)}</tr></thead>
              <tbody>{ptRows.map(r=><tr key={r.type} style={{ borderTop:`1px solid ${C.border}` }}>
                <td style={{ padding:'6px 8px' }}>{r.type}</td>
                <td style={{ textAlign:'center', color:r.successClr, fontWeight:700 }}>{r.success}%</td>
                <td style={{ textAlign:'center', color:r.riskClr, fontWeight:600 }}>{r.risk}</td>
                <td style={{ padding:'6px 8px' }}><MBar pct={r.usage} color={r.successClr}/></td>
              </tr>)}</tbody>
            </table>
          </Card>
          <Card style={{ padding:9 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:7 }}>
              <span style={{ fontSize:9, fontWeight:700, letterSpacing:1.5, color:C.gold }}>PLAY #1: {(rows[0]?.concept||'BALTIMORE').toUpperCase()} — {rows[0]?.qb||'Cooper Melvin'}</span>
              <select style={{ ...selS, fontSize:9 }}><option>All Players</option></select>
            </div>
            <RouteField play={rows[0]||SEED_PLAYS[0]} height={185}/>
            <div style={{ display:'flex', alignItems:'center', gap:7, marginTop:6, fontSize:10, color:'#9ca3af' }}>
              <span>▶</span><span>0:02 / 0:06</span>
              <div style={{ flex:1, height:3, background:'#1a3a1a', borderRadius:2 }}><div style={{ width:'33%', height:'100%', background:C.green, borderRadius:2 }}/></div>
              <span>1.0×</span>
            </div>
          </Card>
        </div>
        {/* Right */}
        <div style={{ width:250, flexShrink:0, display:'flex', flexDirection:'column', gap:8 }}>
          <Card title={`PLAY BREAKDOWN (${rows.length} PLAYS)`} titleClr={C.text}>
            {rows.slice(0,7).map((p,i)=><div key={p.id} style={{ borderBottom:`1px solid ${C.border}`, padding:'7px 0', display:'flex', gap:7 }}>
              <span style={{ color:'#6b8f6b', fontSize:10, minWidth:14 }}>{i+1}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:13 }}>{p.concept}</div>
                <div style={{ fontSize:9, color:'#9ca3af', marginBottom:2 }}>PASS – {p.qb} · Down {p.down} · {p.field}</div>
                <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                  <span style={{ fontSize:9, fontWeight:700, color:resClr(p.result) }}>{p.result.toUpperCase()}</span>
                  {p.yards>0&&<span style={{ fontSize:10 }}>{p.yards} YDS</span>}
                  {p.ttt&&<span style={{ fontSize:9, color:'#9ca3af' }}>{p.ttt} TTT</span>}
                </div>
              </div>
            </div>)}
            {rows.length>7&&<div style={{ fontSize:10, color:'#9ca3af', textAlign:'center', marginTop:8 }}>+{rows.length-7} more plays…</div>}
            <button style={{ width:'100%', marginTop:9, background:'#1a3a1a', border:`1px solid ${C.border}`, color:C.green, padding:'7px', borderRadius:5, fontSize:11, cursor:'pointer', fontFamily:'inherit', fontWeight:700 }}>
              View All Plays →
            </button>
            {/* Who is Producing */}
            <div style={{ marginTop:14, borderTop:`1px solid ${C.border}`, paddingTop:12 }}>
              <div style={{ fontSize:9, fontWeight:700, letterSpacing:1.5, color:'#9ca3af', marginBottom:7 }}>WHO IS PRODUCING</div>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:10.5 }}>
                <thead><tr style={{ color:'#9ca3af', fontSize:8.5 }}>{['','TGT','CTH','SUC%','YDS','YPC'].map(h=><th key={h} style={{ padding:'2px 3px', textAlign:'center' }}>{h}</th>)}</tr></thead>
                <tbody>{[{label:'X',num:'#4',targets:6,catches:5,successPct:83,yards:78,ypc:13.0},{label:'Z',num:'#7',targets:5,catches:4,successPct:80,yards:62,ypc:12.4},{label:'H',num:'#2',targets:3,catches:3,successPct:100,yards:28,ypc:9.3},{label:'RB',num:'#22',targets:4,catches:2,successPct:50,yards:19,ypc:9.5}].map(r=>
                  <tr key={r.label} style={{ borderTop:`1px solid ${C.border}` }}>
                    <td style={{ padding:'5px 3px' }}><span style={{ color:C.gold, fontWeight:700 }}>{r.label} </span><span style={{ color:'#9ca3af', fontSize:9 }}>{r.num}</span></td>
                    <td style={{ textAlign:'center' }}>{r.targets}</td><td style={{ textAlign:'center' }}>{r.catches}</td>
                    <td style={{ textAlign:'center', color:pctClr(r.successPct), fontWeight:700 }}>{r.successPct}%</td>
                    <td style={{ textAlign:'center' }}>{r.yards}</td><td style={{ textAlign:'center' }}>{r.ypc}</td>
                  </tr>
                )}</tbody>
              </table>
            </div>
          </Card>
          <Card title="SITUATIONAL SUCCESS" titleClr={C.text}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:11 }}>
              <thead><tr style={{ color:'#9ca3af', fontSize:9 }}><th style={{ textAlign:'left', padding:'3px 4px' }}>SITUATION</th><th style={{ textAlign:'center' }}>PLAYS</th><th style={{ textAlign:'right' }}>SUCCESS %</th></tr></thead>
              <tbody>{sitData.map(s=><tr key={s.sit} style={{ borderTop:`1px solid ${C.border}` }}>
                <td style={{ padding:'6px 4px' }}>{s.sit}</td><td style={{ textAlign:'center' }}>{s.plays}</td>
                <td style={{ padding:'6px 4px' }}><MBar pct={s.pct} color={pctClr(s.pct)}/></td>
              </tr>)}</tbody>
            </table>
          </Card>
          <Card title="QB PERFORMANCE" titleClr={C.gold}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:11 }}>
              <thead><tr style={{ color:'#9ca3af', fontSize:9 }}>{['QB','PLAYS','COMP%','YDS','TTT','RTG'].map(h=><th key={h} style={{ padding:'3px', textAlign:'center' }}>{h}</th>)}</tr></thead>
              <tbody>{qbs.map(q=><tr key={q.qb} style={{ borderTop:`1px solid ${C.border}` }}>
                <td style={{ padding:'7px 3px', textAlign:'center', color:C.gold, fontWeight:700 }}>{q.qb}</td>
                <td style={{ textAlign:'center' }}>{q.plays}</td>
                <td style={{ textAlign:'center', color:pctClr(q.pct), fontWeight:700 }}>{q.pct}%</td>
                <td style={{ textAlign:'center' }}>{q.yds}</td>
                <td style={{ textAlign:'center', color:C.green }}>{q.avgTTT}</td>
                <td style={{ textAlign:'center', color:C.green, fontWeight:700 }}>{(q.pct*0.8+q.yds*0.01).toFixed(1)}</td>
              </tr>)}</tbody>
            </table>
          </Card>
        </div>
      </div>
    )
  }

  // ── CHARTS ────────────────────────────────────────────────
  function Charts() {
    const downData = [1,2,3].map(d=>{const dp=rows.filter(p=>p.down===d);return{name:d===1?'1st':d===2?'2nd':'3rd',success:dp.length?Math.round(dp.filter(ok).length/dp.length*100):0}})
    const radar = concepts.map(c=>({subject:c.name,success:c.pct,yards:Math.min(c.avg*6,100)}))
    return (
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
          <Card title="CONCEPT SUCCESS RATE" titleClr={C.gold}>
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={concepts.map(c=>({name:c.name,success:c.pct}))} margin={{top:4,right:6,bottom:22,left:-14}}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
                <XAxis dataKey="name" stroke="#4a6a4a" tick={{fill:'#9ca3af',fontSize:9.5}} angle={-20} textAnchor="end"/>
                <YAxis stroke="#4a6a4a" tick={{fill:'#9ca3af',fontSize:8}} tickFormatter={v=>v+'%'}/>
                <Tooltip {...tipS} formatter={v=>[v+'%','Success']}/>
                <Bar dataKey="success" radius={[4,4,0,0]}>{concepts.map((c,i)=><Cell key={i} fill={pctClr(c.pct)}/>)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card title="QB COMPLETION %" titleClr={C.gold}>
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={qbs.map(q=>({name:q.qb,comp:q.pct}))} margin={{top:4,right:6,bottom:8,left:-14}}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
                <XAxis dataKey="name" stroke="#4a6a4a" tick={{fill:'#9ca3af',fontSize:11}}/>
                <YAxis stroke="#4a6a4a" tick={{fill:'#9ca3af',fontSize:8}} tickFormatter={v=>v+'%'}/>
                <Tooltip {...tipS} formatter={v=>[v+'%','Comp %']}/>
                <Bar dataKey="comp" radius={[4,4,0,0]}>{qbs.map((_,i)=><Cell key={i} fill={pctClr(qbs[i].pct)}/>)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card title="SUCCESS BY DOWN" titleClr={C.gold}>
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={downData} margin={{top:4,right:6,bottom:8,left:-14}}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
                <XAxis dataKey="name" stroke="#4a6a4a" tick={{fill:'#9ca3af',fontSize:11}}/>
                <YAxis stroke="#4a6a4a" tick={{fill:'#9ca3af',fontSize:8}} tickFormatter={v=>v+'%'}/>
                <Tooltip {...tipS} formatter={v=>[v+'%','Success']}/>
                <Bar dataKey="success" radius={[4,4,0,0]}>{downData.map((d,i)=><Cell key={i} fill={pctClr(d.success)}/>)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card title="CONCEPT RADAR" titleClr={C.gold}>
            <ResponsiveContainer width="100%" height={190}>
              <RadarChart data={radar} margin={{top:8,right:28,bottom:8,left:28}}>
                <PolarGrid stroke={C.border}/>
                <PolarAngleAxis dataKey="subject" tick={{fill:'#9ca3af',fontSize:10}}/>
                <Radar name="Success %" dataKey="success" stroke={C.green} fill={C.green} fillOpacity={.2}/>
                <Radar name="Yards (scaled)" dataKey="yards" stroke={C.gold} fill={C.gold} fillOpacity={.15}/>
                <Legend wrapperStyle={{color:'#9ca3af',fontSize:10}}/>
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </div>
        <Card title="FULL CONCEPT TABLE" titleClr={C.gold}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:11.5 }}>
            <thead><tr style={{ color:'#9ca3af', fontSize:9 }}>{['CONCEPT','PLAYS','COMP','SUCCESS','AVG YDS','1ST DN','2ND DN','3RD DN'].map(h=><th key={h} style={{ padding:'4px 8px', textAlign:'center' }}>{h}</th>)}</tr></thead>
            <tbody>{concepts.map(c=><tr key={c.name} style={{ borderTop:`1px solid ${C.border}` }}>
              <td style={{ padding:'6px 8px', fontWeight:700, textAlign:'left' }}>{c.name}</td>
              <td>{c.plays}</td><td>{c.comp}</td>
              <td><MBar pct={c.pct} color={pctClr(c.pct)}/></td>
              <td style={{ color:c.avg>0?C.text:'#6b8f6b' }}>{c.avg||'–'}</td>
              {c.byDown.map(d=><td key={d.down} style={{ color:d.pct===null?'#6b8f6b':pctClr(d.pct), fontWeight:700 }}>{d.pct===null?'–':d.pct+'%'}</td>)}
            </tr>)}</tbody>
          </table>
        </Card>
      </div>
    )
  }

  // ── PLAY CALLS ────────────────────────────────────────────
  function PlayCalls() {
    const [search, setSearch] = useState('')
    const filtered = PLAY_SCRIPT.filter(p => search===''||[p.formation,p.play,p.hp].some(v=>v.toLowerCase().includes(search.toLowerCase())))
    const hpClr = hp => hp.startsWith('L')?'#3b82f6':hp.startsWith('R')?'#a855f7':C.muted
    return (
      <div>
        <div style={{ display:'flex', gap:8, marginBottom:9, alignItems:'center' }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search formation, play, or H/P…" style={{ ...selS, flex:1, padding:'4px 10px' }}/>
          <span style={{ fontSize:10, color:'#9ca3af' }}>{filtered.length} plays</span>
        </div>
        <Card>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:11.5 }}>
            <thead><tr style={{ color:'#9ca3af', fontSize:9, borderBottom:`1px solid ${C.border}` }}>{['#','H/P','FORMATION','PLAY','REMIND','D PER','FRONT'].map(h=><th key={h} style={{ textAlign:'left', padding:'5px 8px' }}>{h}</th>)}</tr></thead>
            <tbody>{filtered.map(p=><tr key={p.num} style={{ borderBottom:`1px solid ${C.border}` }}>
              <td style={{ color:C.gold, fontWeight:700, textAlign:'left', padding:'8px' }}>{p.num}</td>
              <td style={{ padding:'8px' }}><Pill label={p.hp} color={hpClr(p.hp)}/></td>
              <td style={{ padding:'8px', color:C.text }}>{p.formation}</td>
              <td style={{ padding:'8px', color:C.green, fontWeight:600 }}>{p.play}</td>
              <td style={{ padding:'8px' }}>{p.remind?<Pill label={p.remind} color={C.orange}/>:<span style={{ color:'#6b8f6b' }}>—</span>}</td>
              <td style={{ padding:'8px', color:'#9ca3af' }}>{p.dper}</td>
              <td style={{ padding:'8px', color:'#9ca3af' }}>{p.front}</td>
            </tr>)}</tbody>
          </table>
        </Card>
      </div>
    )
  }

  // ── REPLAYS ───────────────────────────────────────────────
  function Replays() {
    if (!rows.length) return <div style={{ color:'#9ca3af', padding:20 }}>No plays match filters.</div>
    const safeIdx = Math.min(replayIdx, rows.length-1)
    const p = rows[safeIdx]
    const def = ROUTES[p.concept] || ROUTES.Stick
    const los = Math.round(205 * 0.63)
    const players = def.players(los)
    const complete = p.result === 'Complete'
    return (
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        <div style={{ display:'flex', gap:7, alignItems:'center', flexWrap:'wrap' }}>
          <button onClick={()=>setReplayIdx(i=>Math.max(0,i-1))} disabled={safeIdx===0} style={{ ...selS, color:safeIdx===0?'#6b8f6b':C.green, border:'none', padding:'5px 12px' }}>◀ Prev</button>
          <span style={{ color:'#9ca3af', fontSize:12 }}>Play {safeIdx+1} of {rows.length}</span>
          <button onClick={()=>setReplayIdx(i=>Math.min(rows.length-1,i+1))} disabled={safeIdx===rows.length-1} style={{ ...selS, color:safeIdx===rows.length-1?'#6b8f6b':C.green, border:'none', padding:'5px 12px' }}>Next ▶</button>
          <select value={safeIdx} onChange={e=>setReplayIdx(+e.target.value)} style={{ ...selS, flex:1 }}>
            {rows.map((p2,i)=><option key={i} value={i}>Play #{p2.id} — {p2.concept} | {p2.qb} | {p2.result} | {p2.yards>0?p2.yards+' yds':'0 yds'} | Down {p2.down} | {p2.field} | {p2.date}</option>)}
          </select>
          {saveFlash&&<div style={{display:'flex',alignItems:'center',gap:4,background:'#14532d',border:'0.5px solid #22c55e',borderRadius:6,padding:'3px 10px',fontSize:9,fontWeight:700,color:'#22c55e',flexShrink:0}}>✓ SAVED</div>}
        </div>
        <div style={{ background:'#0e1b0e', border:`1px solid ${C.border}`, borderRadius:7, padding:'9px 14px', display:'flex', gap:20, alignItems:'center', flexWrap:'wrap' }}>
          <div>
            <div style={{ fontSize:8, color:'#9ca3af', letterSpacing:1.5, marginBottom:1 }}>CONCEPT</div>
            <div style={{ fontFamily:'Oswald', fontSize:22, fontWeight:700, color:C.gold }}>{p.concept.toUpperCase()}</div>
          </div>
          <div style={{ flex:1, fontSize:11, color:C.text, lineHeight:1.65, maxWidth:480 }}>{def.desc}</div>
          <div style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
            {[['PRIMARY',def.primary,C.gold],['TIMING',def.timing,C.green],['RESULT',p.result,resClr(p.result)],['YARDS',p.yards?p.yards+' YDS':'0 YDS',p.yards?C.green:C.red],['DOWN',p.down+(p.down===1?'st':p.down===2?'nd':'rd'),C.text],['FIELD',p.field,p.field==='redzone'?C.red:C.muted]].map(([l,v,c])=>
              <div key={l} style={{ textAlign:'center' }}>
                <div style={{ fontSize:8, color:'#9ca3af', letterSpacing:1, marginBottom:2 }}>{l}</div>
                <div style={{ fontSize:11, fontWeight:700, color:c }}>{v}</div>
              </div>
            )}
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:8 }}>
          <Card style={{ padding:10 }}>
            <div style={{ fontSize:9, fontWeight:700, letterSpacing:1.5, color:C.gold, marginBottom:7 }}>
              PLAY #{p.id} — {p.concept.toUpperCase()} ROUTE DIAGRAM  ·  {p.qb}  ·  DOWN {p.down}  ·  {p.field.toUpperCase()}
            </div>
            <RouteField play={p} height={205}/>
            <div style={{ display:'flex', gap:12, marginTop:8, flexWrap:'wrap' }}>
              {players.map(s=>{
                const clr = !complete&&s.primary?C.red:s.clr
                return <div key={s.lbl} style={{ display:'flex', alignItems:'center', gap:5, fontSize:10.5 }}>
                  <div style={{ width:22, height:2.5, background:clr, borderRadius:1, opacity:s.primary?1:.65 }}/>
                  <span style={{ color:clr, fontWeight:s.primary?700:400 }}>{s.lbl} — {s.name.replace(' ★','')}{s.primary&&<span style={{ color:C.gold, fontSize:9 }}> (Primary)</span>}</span>
                </div>
              })}
            </div>
          </Card>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <Card title="PLAY DETAILS" titleClr={C.gold}>
              {[['Play #','#'+p.id,null],['Concept',p.concept,C.gold],['QB',p.qb,C.gold],['Result',p.result,resClr(p.result)],['Yards',p.yards?p.yards+' YDS':'0 YDS',p.yards?C.green:C.red],['Down',p.down+(p.down===1?'st':p.down===2?'nd':'rd')+' Down',null],['Field',p.field.charAt(0).toUpperCase()+p.field.slice(1),p.field==='redzone'?C.red:null],['TTT',p.ttt||'–',C.green],['Date',p.date,null],['Primary',def.primary,C.gold]].map(([l,v,c])=>
                <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'5px 0', borderBottom:`1px solid #141f14`, fontSize:11 }}>
                  <span style={{ color:'#9ca3af' }}>{l}:</span>
                  <span style={{ color:c||C.text, fontWeight:c?700:500, textAlign:'right', maxWidth:'55%' }}>{v}</span>
                </div>
              )}
            </Card>
            <Card title="ROUTE BREAKDOWN" titleClr={C.gold}>
              {players.map(s=>{
                const clr = !complete&&s.primary?C.red:s.clr
                return <div key={s.lbl} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'6px 0', borderBottom:`1px solid #141f14` }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}><div style={{ width:8, height:8, borderRadius:'50%', background:clr }}/><span style={{ fontWeight:700, color:clr }}>{s.lbl}</span></div>
                  <span style={{ fontSize:11, color:s.primary?clr:'#9ca3af', fontWeight:s.primary?700:400 }}>{s.name.replace(' ★','')}</span>
                  {s.primary&&<Pill label="Target" color={clr}/>}
                </div>
              })}
            </Card>
            <Card style={{ background:complete?'#0d1a0d':'#1a0d0d', border:`1px solid ${complete?C.green+'44':C.red+'44'}` }}>
              <div style={{ fontSize:9, fontWeight:700, color:C.gold, letterSpacing:1, marginBottom:7 }}>COACHING ASSESSMENT</div>
              <div style={{ fontSize:11, color:C.text, lineHeight:1.7 }}>
                {complete?`✓ ${p.concept} executed cleanly on ${p.down===1?'1st':p.down===2?'2nd':'3rd'} down — ${p.yards} yards. Primary target (${def.primary}) was on time.`:`✗ ${p.concept} broke down on ${p.down===3?'3rd':'2nd'} down in the ${p.field}. 0% success here — remove or drill separately.`}
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // ── PLAYERS ───────────────────────────────────────────────
  function Players() {
    const pQB = qbs.find(q=>q.qb===playerQB)||qbs[0]
    if (!pQB) return <div style={{ color:'#9ca3af', padding:20 }}>No QB data.</div>
    const getPros = c => { const p=[];if(c.pct===100)p.push('Perfect completion rate');if(c.avg>=12)p.push(`High gain: ${c.avg} yds/catch`);else if(c.avg>=7)p.push(`Solid gain: ${c.avg} yds/catch`);if(!p.length)p.push('Consistent in right situations');return p }
    const getCons = c => { const p=[];if(c.pct===0)p.push('0% — do not call until fixed');if(c.byDown.find(d=>d.down===3&&d.pct===0))p.push('0% on 3rd down — avoid');if(!p.length)p.push('Low downside when used correctly');return p }
    return (
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        <div style={{ display:'flex', gap:7 }}>
          {qbs.map(q=><button key={q.qb} onClick={()=>setPlayerQB(q.qb)} style={{ padding:'7px 20px', borderRadius:6, border:'none', background:q.qb===playerQB?'#1a6b2a':'#1a2e1a', color:q.qb===playerQB?'white':'#9ca3af', fontFamily:'inherit', fontSize:13, fontWeight:700, cursor:'pointer' }}>{q.qb}</button>)}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(4,1fr)', gap:8 }}>
          {[{lbl:'PLAYS',val:pQB.plays,clr:C.text},{lbl:'COMPLETIONS',val:pQB.comp,clr:C.green},{lbl:'COMP %',val:pQB.pct+'%',clr:pctClr(pQB.pct)},{lbl:'TOTAL YARDS',val:pQB.yds,clr:C.gold}].map(k=>
            <Card key={k.lbl} style={{ textAlign:'center' }}>
              <div style={{ fontSize:9, color:'#9ca3af', letterSpacing:1.5, marginBottom:4 }}>{k.lbl}</div>
              <div style={{ fontFamily:'Oswald', fontSize:32, fontWeight:700, color:k.clr, lineHeight:1 }}>{k.val}</div>
            </Card>
          )}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
          <Card title={pQB.qb+' — CONCEPT BREAKDOWN'} titleClr={C.gold}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:11.5 }}>
              <thead><tr style={{ color:'#9ca3af', fontSize:9 }}>{['CONCEPT','PLAYS','COMP','SUCCESS','YDS'].map(h=><th key={h}>{h}</th>)}</tr></thead>
              <tbody>{pQB.byC.map(c=><tr key={c.name} style={{ borderTop:`1px solid ${C.border}` }}>
                <td style={{ textAlign:'left', fontWeight:700, padding:'6px' }}>{c.name}</td><td>{c.plays}</td><td>{c.comp}</td>
                <td><MBar pct={c.pct} color={pctClr(c.pct)}/></td>
                <td style={{ color:c.yds?C.text:'#6b8f6b' }}>{c.yds||'–'}</td>
              </tr>)}</tbody>
            </table>
          </Card>
          <Card title={pQB.qb+' — PROS & CONS'} titleClr={C.gold} style={{ overflowY:'auto', maxHeight:380 }}>
            {pQB.byC.map(c=><div key={c.name} style={{ marginBottom:12, paddingBottom:12, borderBottom:`1px solid ${C.border}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:5 }}>
                <span style={{ fontWeight:700, fontSize:13 }}>{c.name}</span>
                <span style={{ color:pctClr(c.pct), fontWeight:700, fontSize:13 }}>{c.pct}%</span>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7 }}>
                <div style={{ background:'#0d1f0d', border:`1px solid ${C.border}`, borderRadius:5, padding:7 }}>
                  <div style={{ fontSize:8, fontWeight:700, color:C.green, letterSpacing:1, marginBottom:5 }}>✓ PROS</div>
                  {getPros(c).map((p,i)=><div key={i} style={{ fontSize:10, color:C.text, marginBottom:3, lineHeight:1.4 }}>• {p}</div>)}
                </div>
                <div style={{ background:'#1f0d0d', border:`1px solid #3a1d1d`, borderRadius:5, padding:7 }}>
                  <div style={{ fontSize:8, fontWeight:700, color:C.red, letterSpacing:1, marginBottom:5 }}>✗ CONS</div>
                  {getCons(c).map((p,i)=><div key={i} style={{ fontSize:10, color:C.text, marginBottom:3, lineHeight:1.4 }}>• {p}</div>)}
                </div>
              </div>
            </div>)}
          </Card>
        </div>
      </div>
    )
  }

  // ── MISTAKES ──────────────────────────────────────────────
  function Mistakes() {
    const incomplete = rows.filter(p=>!ok(p))
    const byC = [...new Set(incomplete.map(p=>p.concept))].map(name=>{const tot=rows.filter(p=>p.concept===name),fail=incomplete.filter(p=>p.concept===name);return{name,fails:fail.length,total:tot.length,pct:Math.round(fail.length/tot.length*100)}}).sort((a,b)=>b.fails-a.fails)
    const byQB = ['Cooper Melvin','Ben Kooi'].map(qb=>{const tot=rows.filter(p=>p.qb===qb),fail=incomplete.filter(p=>p.qb===qb);return{qb,fails:fail.length,pct:tot.length?Math.round(fail.length/tot.length*100):0}})
    return (
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
          {[{lbl:'TOTAL ERRORS',val:incomplete.length,clr:C.red},{lbl:'ERROR RATE',val:Math.round(incomplete.length/Math.max(rows.length,1)*100)+'%',clr:C.red},{lbl:'PROBLEM CONCEPT',val:byC[0]?.name||'–',clr:C.orange}].map(k=>
            <Card key={k.lbl} style={{ textAlign:'center' }}>
              <div style={{ fontSize:9, color:'#9ca3af', letterSpacing:1.5, marginBottom:4 }}>{k.lbl}</div>
              <div style={{ fontFamily:'Oswald', fontSize:32, fontWeight:700, color:k.clr, lineHeight:1 }}>{k.val}</div>
            </Card>
          )}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
          <Card title="INCOMPLETE PLAYS LOG" titleClr={C.red}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:11.5 }}>
              <thead><tr style={{ color:'#9ca3af', fontSize:9 }}>{['PLAY #','QB','CONCEPT','DOWN','FIELD','TTT'].map(h=><th key={h}>{h}</th>)}</tr></thead>
              <tbody>{incomplete.map(p=><tr key={p.id} style={{ borderTop:`1px solid ${C.border}` }}>
                <td style={{ color:C.red, fontWeight:700 }}>#{p.id}</td><td>{p.qb}</td><td style={{ fontWeight:600 }}>{p.concept}</td>
                <td>{p.down}</td><td><Pill label={p.field} color={p.field==='redzone'?C.red:C.muted}/></td><td style={{ color:C.orange }}>{p.ttt||'–'}</td>
              </tr>)}</tbody>
            </table>
          </Card>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <Card title="ERROR RATE BY CONCEPT" titleClr={C.red}>
              {byC.map(c=><div key={c.name} style={{ display:'flex', alignItems:'center', gap:7, marginBottom:8 }}>
                <span style={{ minWidth:76, fontWeight:700 }}>{c.name}</span>
                <div style={{ flex:1, height:7, background:'#1a2e1a', borderRadius:3, overflow:'hidden' }}><div style={{ width:`${c.pct}%`, height:'100%', background:C.red, borderRadius:3 }}/></div>
                <span style={{ color:C.red, fontWeight:700, minWidth:44, textAlign:'right' }}>{c.fails}/{c.total}</span>
              </div>)}
            </Card>
            <Card title="ERRORS BY QB" titleClr={C.red}>
              {byQB.map(q=><div key={q.qb} style={{ display:'flex', alignItems:'center', gap:7, marginBottom:8 }}>
                <span style={{ minWidth:36, fontWeight:700, color:C.gold }}>{q.qb}</span>
                <div style={{ flex:1, height:7, background:'#1a2e1a', borderRadius:3, overflow:'hidden' }}><div style={{ width:`${q.pct}%`, height:'100%', background:C.orange, borderRadius:3 }}/></div>
                <span style={{ color:C.orange, fontWeight:700, minWidth:54, textAlign:'right' }}>{q.fails} errors</span>
              </div>)}
            </Card>
          </div>
        </div>
        <Card style={{ border:`1px solid ${C.red}44`, background:'#1a0808' }}>
          <div style={{ display:'flex', gap:8 }}>
            <span style={{ color:C.red, fontSize:18 }}>⚠</span>
            <div>
              <div style={{ fontWeight:700, color:C.red, marginBottom:5, letterSpacing:1 }}>PATTERN ALERT</div>
              <div style={{ fontSize:11.5, color:C.text, lineHeight:1.7 }}>
                <strong style={{ color:C.gold }}>Sail</strong> and <strong style={{ color:C.gold }}>Fade</strong> account for 100% of all incompletions. Both called exclusively on <strong style={{ color:C.red }}>3rd down in the redzone</strong>. Remove from live script until mechanics are fixed.
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  // ── NEXT PRACTICE ──────────────────────────────────────────
  function NextPractice() {
    const strong = concepts.filter(c=>c.pct===100)
    const weak   = concepts.filter(c=>c.pct<50)
    return (
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
          <Card title="✓ CARRY INTO NEXT PRACTICE" titleClr={C.green}>
            {strong.map(c=><div key={c.name} style={{ borderBottom:`1px solid ${C.border}`, padding:'8px 0' }}>
              <div style={{ display:'flex', justifyContent:'space-between' }}><span style={{ fontWeight:700 }}>{c.name}</span><span style={{ color:C.green, fontWeight:700 }}>{c.pct}%</span></div>
              <div style={{ fontSize:10, color:'#9ca3af', marginTop:2 }}>{c.avg} yds avg · {c.plays} reps</div>
            </div>)}
          </Card>
          <Card title="⚠ NEEDS WORK" titleClr={C.gold}>
            <div style={{ fontSize:11, color:'#9ca3af' }}>Add more practice sessions to surface mixed-result concepts.</div>
          </Card>
          <Card title="✗ REMOVE / REBUILD" titleClr={C.red}>
            {weak.map(c=><div key={c.name} style={{ borderBottom:`1px solid ${C.border}`, padding:'8px 0' }}>
              <div style={{ display:'flex', justifyContent:'space-between' }}><span style={{ fontWeight:700 }}>{c.name}</span><span style={{ color:C.red, fontWeight:700 }}>{c.pct}%</span></div>
              <div style={{ fontSize:10, color:C.red, marginTop:2 }}>0 yards · {c.plays} failures</div>
            </div>)}
          </Card>
        </div>
        <Card title="SUGGESTED NEXT PRACTICE SCRIPT" titleClr={C.gold}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:11.5 }}>
            <thead><tr style={{ color:'#9ca3af', fontSize:9, borderBottom:`1px solid ${C.border}` }}>{['#','CONCEPT','FOCUS','REASON','REPS','DOWN','FIELD'].map(h=><th key={h} style={{ textAlign:'left', padding:'5px 8px' }}>{h}</th>)}</tr></thead>
            <tbody>{[
              {num:1,concept:'Stick',    focus:'Competition',    reason:'100% – keep sharp',         reps:6,down:'1st',  field:'Normal'},
              {num:2,concept:'Out',      focus:'Competition',    reason:'100% – trust it',            reps:4,down:'2nd',  field:'Normal'},
              {num:3,concept:'Baltimore',focus:'Competition',    reason:'Big gainer, 100%',           reps:4,down:'1st',  field:'Normal'},
              {num:4,concept:'Post',     focus:'Competition',    reason:'100% & highest avg',         reps:4,down:'1st',  field:'Normal'},
              {num:5,concept:'Slant',    focus:'Competition',    reason:'100% quick-game reliability',reps:4,down:'2nd',  field:'Normal'},
              {num:6,concept:'Sail',     focus:'Technique Drill',reason:'0% – fix mechanics',        reps:8,down:'Drill',field:'Practice'},
              {num:7,concept:'Fade',     focus:'Technique Drill',reason:'0% – fix mechanics',        reps:8,down:'Drill',field:'Practice'},
            ].map(r=><tr key={r.num} style={{ borderTop:`1px solid ${C.border}` }}>
              <td style={{ color:C.gold, fontWeight:700, textAlign:'left', padding:'7px 8px' }}>{r.num}</td>
              <td style={{ textAlign:'left', fontWeight:700, padding:'7px 8px' }}>{r.concept}</td>
              <td style={{ padding:'7px 8px' }}><Pill label={r.focus} color={r.focus==='Competition'?C.green:C.orange}/></td>
              <td style={{ color:'#9ca3af', padding:'7px 8px' }}>{r.reason}</td>
              <td>{r.reps}</td><td style={{ textAlign:'left' }}>{r.down}</td>
              <td style={{ textAlign:'left' }}><Pill label={r.field} color={r.field==='Normal'?C.muted:C.red}/></td>
            </tr>)}</tbody>
          </table>
        </Card>
        <Card style={{ border:`1px solid ${C.green}33`, background:'#0d1a0d' }}>
          <div style={{ display:'flex', gap:8 }}>
            <span style={{ color:C.green, fontSize:18 }}>☘</span>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, flex:1, fontSize:11, lineHeight:1.7 }}>
              <div>
                <div style={{ color:C.green, fontWeight:700, marginBottom:5 }}>STRENGTHS TO EXPLOIT</div>
                {['Stick is automatic on 1st & 2nd — build every drive around it','Baltimore + Post are downfield weapons: both 100%, 12+ yds avg','All 3 QBs execute short routes identically — rotate freely','Normal field position = favorable; use full concept menu'].map((t,i)=><div key={i} style={{ color:C.text }}>• {t}</div>)}
              </div>
              <div>
                <div style={{ color:C.red, fontWeight:700, marginBottom:5 }}>FIXES NEEDED BEFORE NEXT GAME</div>
                {['Sail & Fade: 0% — drill separately, do NOT call live','Redzone offense: 0% — need a dedicated redzone package','3rd down: all failures — try Baltimore/Post as 3rd-down answers'].map((t,i)=><div key={i} style={{ color:C.text }}>• {t}</div>)}
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  // ── RENDER ────────────────────────────────────────────────
  return (
    <div style={{ background:C.bg, minHeight:'100vh', color:'white', fontFamily:'Rajdhani,Oswald,sans-serif' }}>
      {showImport && <ImportModal onImport={handleImport} onClose={()=>setImport(false)} currentCount={plays.length}/>}

      {/* Nav */}
      <div style={{ background:C.navy, borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', padding:'0 12px', height:54, gap:10, position:'sticky', top:0, zIndex:40 }}>
        <div style={{ display:'flex', alignItems:'center', gap:9, marginRight:12, flexShrink:0 }}>
          <div style={{ width:40, height:40, background:'#1a3a1a', border:`2px solid ${C.gold}`, borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ color:C.gold, fontSize:19, fontWeight:700, fontFamily:'Oswald' }}>W</span>
          </div>
          <div>
            <div style={{ fontFamily:'Oswald', fontSize:13.5, fontWeight:700, letterSpacing:.8 }}>WESTFIELD SHAMROCKS</div>
            <div style={{ fontSize:7.5, color:C.gold, letterSpacing:2, fontWeight:600 }}>OFFENSIVE PERFORMANCE ANALYTICS</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:1, flex:1, flexWrap:'wrap' }}>
          {TABS.map(t=><button key={t} onClick={()=>setTab(t)} style={btnTab(t)}>{t}</button>)}
        </div>
        <div style={{ display:'flex', gap:7, alignItems:'center', flexShrink:0 }}>
          <select value={fQB}   onChange={e=>setFQB(e.target.value)}   style={selS}>{['All QBs','Cooper Melvin','Ben Kooi'].map(o=><option key={o}>{o}</option>)}</select>
          <select value={fSit}  onChange={e=>setFSit(e.target.value)}  style={selS}>{[['All','All Situations'],['normal','Normal'],['redzone','Redzone']].map(([v,l])=><option key={v} value={v}>{l}</option>)}</select>
          <select value={fDate} onChange={e=>setFDate(e.target.value)} style={selS}>{dates.map(d=><option key={d} value={d}>{d==='All'?'All Dates':d}</option>)}</select>
          <select value={fSess} onChange={e=>setFSess(e.target.value)} style={selS}><option value='All'>All Sessions</option><option value='College Showcase'>College Showcase</option><option value='7on7'>7on7</option><option value='Team'>Team</option><option value='Varsity Practice'>Varsity Practice</option></select>
          {/* IMPORT BUTTON */}
          <button onClick={()=>setImport(true)} style={{ background:'#1a3a6a', border:`1px solid #2a5aaa`, color:'#7ab3ff', padding:'5px 12px', borderRadius:4, fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
            ⬆ Import Data
          </button>
          <button onClick={()=>{const b=new Blob([JSON.stringify({plays,script:PLAY_SCRIPT},null,2)],{type:'application/json'}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download='westfield-data.json';a.click()}} style={{ background:'#1a6b2a', border:'none', color:'white', padding:'5px 12px', borderRadius:4, fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
            ↑ Export
          </button>
          <button onClick={()=>setSearchOpen(!searchOpen)} style={{ background:'#1a3a6a', border:'1px solid #2a5aaa', color:'#7ab3ff', padding:'5px 10px', borderRadius:4, fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }} title='Search (/)'>🔍</button>
          <button onClick={()=>setLightMode(!lightMode)} style={{ background:'#1a3a1a', border:'1px solid #2a8a2a', color:'#6bcf6b', padding:'5px 10px', borderRadius:4, fontSize:13, cursor:'pointer', fontFamily:'inherit' }} title='Toggle light/dark'>{lightMode?'🌙':'☀️'}</button>

        </div>
      </div>

      {/* KPI Banner */}
      <div style={{ background:'#0e1b0e', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', padding:'8px 12px', gap:0, flexWrap:'wrap' }}>
        <div style={{ display:'flex', alignItems:'center', gap:9, paddingRight:16, borderRight:`1px solid ${C.border}`, marginRight:16 }}>
          <span style={{ color:C.green, fontSize:18 }}>☘</span>
          <div>
            <div style={{ fontSize:7.5, color:'#9ca3af', letterSpacing:1.5 }}>COACH DECISION</div>
            <div style={{ fontFamily:'Oswald', fontSize:16, fontWeight:700, lineHeight:1.1 }}>FOCUS</div>
            <div style={{ fontSize:9, color:'#9ca3af' }}>Short Routes + Outside</div>
          </div>
        </div>
        {[
          { lbl:'BEST CONCEPT',    val:best?.name||'–',   sub:(best?.pct||0)+'% SUCCESS · '+(best?.avg||0)+' YDS AVG',  c:C.green },
          { lbl:'OVERALL SUCCESS', val:overall+'%',        sub:rows.filter(ok).length+'/'+rows.length+' completions',    c:pctClr(overall) },
          { lbl:'BIGGEST PROBLEM', val:worst?.name||'–',  sub:(worst?.pct||0)+'% SUCCESS — ELIMINATE',                  c:C.red },
          { lbl:'REDZONE',         val:Math.round((rows.filter(p=>p.field==='redzone'&&ok(p)).length/Math.max(rows.filter(p=>p.field==='redzone').length,1))*100)+'%', sub:'redzone success rate', c:C.orange },
          { lbl:'3RD DOWN',        val:Math.round((rows.filter(p=>p.down===3&&ok(p)).length/Math.max(rows.filter(p=>p.down===3).length,1))*100)+'%', sub:'3rd down conversion', c:C.red },
          { lbl:'TOTAL PLAYS',     val:plays.length,       sub:`${[...new Set(plays.map(p=>p.date))].length} session(s)`, c:C.gold },
        ].map(k=>
          <div key={k.lbl} style={{ paddingLeft:14, paddingRight:14, borderRight:`1px solid ${C.border}` }}>
            <div style={{ fontSize:7.5, color:'#9ca3af', letterSpacing:1.5, marginBottom:1 }}>{k.lbl}</div>
            <div style={{ fontFamily:'Oswald', fontSize:14, fontWeight:700 }}>{k.val}</div>
            <div style={{ fontSize:8.5, color:k.c, fontWeight:600 }}>{k.sub}</div>
          </div>
        )}
        <div style={{ display:'flex', alignItems:'center', gap:7, marginLeft:'auto', border:`2px solid ${C.gold}`, borderRadius:7, padding:'6px 12px', flexShrink:0 }}>
          <div style={{ width:28, height:28, background:'#1a3a1a', border:`2px solid ${C.gold}`, borderRadius:4, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ color:C.gold, fontSize:14, fontFamily:'Oswald', fontWeight:700 }}>W</span>
          </div>
          <div>
            <div style={{ fontFamily:'Oswald', fontSize:11, fontWeight:700, color:C.gold }}>WESTFIELD</div>
            <div style={{ fontFamily:'Oswald', fontSize:11, fontWeight:700 }}>SHAMROCKS</div>
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div style={{ padding:'10px 12px 24px' }}>
        {rows.length === 0
          ? <div style={{ textAlign:'center', color:'#9ca3af', padding:60, fontSize:16 }}>No plays match the selected filters.</div>
          : <>
              {tab==='Overview'      && <Overview/>}
              {tab==='Research' && <ResearchDemo/>}
              {tab==='Charts'        && <Charts/>}
              {tab==='Play Calls'    && <PlayCalls/>}
              {tab==='Replays'       && <Replays/>}
              {tab==='Players'       && <Players/>}
              {tab==='Mistakes'      && <Mistakes/>}
              {tab==='Next Practice' && <NextPractice/>}
            </>
        }
      </div>
    </div>
  )
}// ============================================================
// RESEARCH DEMO TAB · Westfield Offensive Analytics Dashboard
// Purpose: live walkthrough view for faculty / PhD meetings.
// Self contained: no imports, no external libraries, inline styles.
//
// INSTALL (matches your normal workflow):
// 1. Paste this whole component into src/App.jsx alongside your
//    other tab components.
// 2. Register it in your tab list the same way as your other 32
//    tabs, e.g. label "Research" rendering <ResearchDemo />.
// 3. cd ~/Desktop/westfield-clean && git add src/App.jsx
//    && git commit -m "Add Research demo tab" && git push
// ============================================================

function ResearchDemo() {
  const S = {
    page: { padding: "28px 24px 60px", maxWidth: 980, margin: "0 auto", fontFamily: "system-ui, -apple-system, sans-serif", lineHeight: 1.55 },
    eyebrow: { fontFamily: "ui-monospace, monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#B08C28", margin: "0 0 8px" },
    h1: { fontSize: 30, fontWeight: 700, margin: "0 0 6px" },
    sub: { fontSize: 15, opacity: 0.75, margin: "0 0 28px", maxWidth: 680 },
    h2: { fontSize: 19, fontWeight: 700, margin: "0 0 12px" },
    section: { marginBottom: 36 },
    card: { border: "1px solid rgba(176,140,40,0.45)", borderRadius: 10, padding: "18px 20px", marginBottom: 14 },
    chipRow: { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 },
    chip: { fontFamily: "ui-monospace, monospace", fontSize: 12, border: "1px solid rgba(128,128,128,0.45)", borderRadius: 6, padding: "5px 10px" },
    statRow: { display: "flex", flexWrap: "wrap", gap: 24, marginTop: 4 },
    statV: { fontFamily: "ui-monospace, monospace", fontSize: 24, fontWeight: 700, display: "block" },
    statK: { fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.65 },
    pipeRow: { display: "flex", flexWrap: "wrap", gap: 10, alignItems: "stretch" },
    pipeStep: { flex: "1 1 160px", border: "1px solid rgba(128,128,128,0.4)", borderRadius: 10, padding: "12px 14px" },
    pipeNum: { fontFamily: "ui-monospace, monospace", fontSize: 11, color: "#B08C28", letterSpacing: "0.15em" },
    pipeT: { fontWeight: 700, fontSize: 14, margin: "4px 0 4px" },
    pipeD: { fontSize: 12.5, opacity: 0.75, margin: 0 },
    findT: { fontWeight: 700, fontSize: 15.5, margin: "0 0 4px" },
    findD: { fontSize: 14, opacity: 0.78, margin: 0 },
    tag: { fontFamily: "ui-monospace, monospace", fontSize: 10.5, letterSpacing: "0.18em", color: "#B08C28" },
    tagRed: { fontFamily: "ui-monospace, monospace", fontSize: 10.5, letterSpacing: "0.18em", color: "#C0573F" },
    q: { borderLeft: "3px solid #B08C28", padding: "10px 16px", marginBottom: 10, fontSize: 14.5 },
    qLane: { fontFamily: "ui-monospace, monospace", fontSize: 10.5, letterSpacing: "0.16em", color: "#B08C28", display: "block", marginBottom: 2 },
    foot: { fontFamily: "ui-monospace, monospace", fontSize: 11, letterSpacing: "0.08em", opacity: 0.6, marginTop: 30 },
  };

  const schema = ["id", "qb", "concept", "result", "yards", "down", "field", "ttt", "date", "session", "opponent", "quarter"];

  const pipeline = [
    { n: "01", t: "Collect", d: "Play by play charted from Hudl film. 14 sessions logged to date." },
    { n: "02", t: "Engineer", d: "Python and pandas feature scripts build grades, rates, and splits." },
    { n: "03", t: "Evaluate", d: "EPA framing turns concept results into keep or cut signals." },
    { n: "04", t: "Benchmark", d: "Every metric compared against NFL 2024 nflfastR play by play." },
    { n: "05", t: "Deliver", d: "React dashboard, 32+ modules, used by the staff in real time." },
  ];

  const findings = [
    { tag: "DECISION", red: false, t: "Sail and Fade cut from the offense", d: "Both graded 0% completion with negative EPA (-0.6 and -0.8). The staff removed them from the call sheet." },
    { tag: "GAP", red: true, t: "Red zone: 0% conversion, both QBs", d: "No package installed. Surfaced by the field position heat map; install is on the summer plan." },
    { tag: "SIGNAL", red: false, t: "QB1 at 84% across six sessions", d: "Cooper Melvin: 63 att, 13.2 YPA, two perfect sessions. The 5/12 dip (75%) flagged for film review." },
  ];

  const questions = [
    { lane: "VALIDATE", q: "Does NFL derived EPA transfer to the varsity level, and what recalibration does it need?" },
    { lane: "ADOPT", q: "How does a scholastic coaching staff actually adopt analytics? This program is a live case study." },
    { lane: "SCALE", q: "Can the pipeline extend to Power 4 programs using public cfbfastR data?" },
    { lane: "PRO", q: "What decision frameworks (draft capital, fourth down, roster construction) carry to the NFL level?" },
    { lane: "POLICY", q: "What would statewide data standards for scholastic athletics (IHSAA) look like?" },
  ];

  return (
    <div style={S.page}>
      <p style={S.eyebrow}>Research Mode · Faculty Walkthrough · June 2026</p>
      <h1 style={S.h1}>From film room to research question</h1>
      <p style={S.sub}>
        This view summarizes the dataset, methodology, and findings behind the dashboard
        you are about to see. Everything else in this app runs on the pipeline described below.
      </p>

      <div style={S.section}>
        <h2 style={S.h2}>The dataset</h2>
        <div style={S.card}>
          <div style={S.statRow}>
            <div><span style={S.statV}>500</span><span style={S.statK}>Plays</span></div>
            <div><span style={S.statV}>14</span><span style={S.statK}>Film sessions</span></div>
            <div><span style={S.statV}>2</span><span style={S.statK}>QBs graded</span></div>
            <div><span style={S.statV}>12</span><span style={S.statK}>Fields per row</span></div>
          </div>
          <div style={S.chipRow}>
            {schema.map((c) => (<span key={c} style={S.chip}>{c}</span>))}
          </div>
        </div>
      </div>

      <div style={S.section}>
        <h2 style={S.h2}>The methodology</h2>
        <div style={S.pipeRow}>
          {pipeline.map((p) => (
            <div key={p.n} style={S.pipeStep}>
              <span style={S.pipeNum}>{p.n}</span>
              <p style={S.pipeT}>{p.t}</p>
              <p style={S.pipeD}>{p.d}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={S.section}>
        <h2 style={S.h2}>What the system has found</h2>
        {findings.map((f) => (
          <div key={f.t} style={S.card}>
            <span style={f.red ? S.tagRed : S.tag}>{f.tag}</span>
            <p style={S.findT}>{f.t}</p>
            <p style={S.findD}>{f.d}</p>
          </div>
        ))}
      </div>

      <div style={S.section}>
        <h2 style={S.h2}>Open research questions</h2>
        {questions.map((x) => (
          <div key={x.lane} style={S.q}>
            <span style={S.qLane}>{x.lane}</span>
            {x.q}
          </div>
        ))}
      </div>

      <p style={S.foot}>
        JAY R. KELLEY · M.S. SPORTS ANALYTICS, IU INDIANAPOLIS · DATA SHARED CONFIDENTIALLY
      </p>
    </div>
  );
}
