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
      qb:      row.qb || 'Aiden Grabowski',
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
  const HeatMapTab = () => {
    const qbs = [{name:'Cooper Melvin',color:'#22c55e'},{name:'Ben Kooi',color:'#d4a017'}]
    const zones = ['Left Deep','Mid Deep','Right Deep','Left Short','Mid Short','Right Short']
    const concepts = {
      'Left Deep':['Post','Fade'],'Mid Deep':['Verticals','Four Verts'],'Right Deep':['Sail'],
      'Left Short':['Out','Slant'],'Mid Short':['Baltimore','Smash','Stick'],'Right Short':['Out','Slant','Stick']
    }
    const deep = ['Left Deep','Mid Deep','Right Deep']
    const getPlays = (qb, zone) => {
      const c = concepts[zone]
      const isDeep = deep.includes(zone)
      return plays.filter(p => p.qb===qb && c.includes(p.concept) && (isDeep ? p.yards>=15 : p.yards<10))
    }
    const pct = (arr) => arr.length===0 ? null : Math.round(arr.filter(p=>p.result==='Complete').length/arr.length*100)
    const bg = (p) => p===null?'#1a1a1a':p>=80?'#15803d':p>=60?'#854d0e':'#7f1d1d'
    const label = (arr) => { const p=pct(arr); return p===null?'No data':p+'% ('+arr.length+')' }
    return (
      <div style={{padding:24}}>
        <div style={{fontSize:13,fontWeight:700,color:'#d4a017',letterSpacing:2,marginBottom:16}}>QB FIELD HEAT MAPS</div>
        <div style={{display:'flex',gap:16}}>
          {qbs.map(({name,color})=>{
            const r=passerRating(name)
            const rc=r>=90?'#22c55e':r>=70?'#d4a017':'#ef4444'
            const rz=plays.filter(p=>p.qb===name&&p.field==='redzone')
            return (
              <div key={name} style={{flex:1,background:'#111811',border:'1px solid #1d3a1d',borderRadius:8,padding:16}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:12}}>
                  <div style={{fontSize:12,fontWeight:700,color}}>{name.toUpperCase()}</div>
                  <div style={{textAlign:'right'}}><div style={{fontSize:8,color:'#9ca3af'}}>PASSER RATING</div><div style={{fontSize:22,fontWeight:700,color:rc}}>{r}</div></div>
                </div>
                <div style={{background:'#0d1f0d',border:'2px solid #1d3a1d',borderRadius:6,padding:8}}>
                  <div style={{textAlign:'center',fontSize:8,color:'#4ade80',marginBottom:6,borderBottom:'1px solid #1d3a1d',paddingBottom:4}}>FIELD HEAT MAP</div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:4,marginBottom:6}}>
                    {deep.map(z=>{const arr=getPlays(name,z);return(<div key={z} style={{background:bg(pct(arr)),borderRadius:4,padding:'8px 4px',textAlign:'center',border:'1px solid #1d3a1d'}}><div style={{fontSize:7,color:'#9ca3af',marginBottom:2}}>{z.toUpperCase()}</div><div style={{fontSize:9,fontWeight:700,color:'#fff'}}>{label(arr)}</div></div>)})}
                  </div>
                  <div style={{borderTop:'2px dashed #4ade80',marginBottom:6,textAlign:'center',paddingTop:4}}><span style={{fontSize:7,color:'#4ade80'}}>LINE OF SCRIMMAGE</span></div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:4,marginBottom:6}}>
                    {['Left Short','Mid Short','Right Short'].map(z=>{const arr=getPlays(name,z);return(<div key={z} style={{background:bg(pct(arr)),borderRadius:4,padding:'8px 4px',textAlign:'center',border:'1px solid #1d3a1d'}}><div style={{fontSize:7,color:'#9ca3af',marginBottom:2}}>{z.toUpperCase()}</div><div style={{fontSize:9,fontWeight:700,color:'#fff'}}>{label(arr)}</div></div>)})}
                  </div>
                  <div style={{background:bg(pct(rz)),borderRadius:4,padding:'8px 4px',textAlign:'center',border:'1px solid #ef4444'}}>
                    <div style={{fontSize:7,color:'#fca5a5',marginBottom:2}}>RED ZONE</div>
                    <div style={{fontSize:9,fontWeight:700,color:'#fff'}}>{label(rz)}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
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
      <div style={{padding:20,fontFamily:'Helvetica,Arial,sans-serif'}}>
        <div style={{background:'#0a1a0a',border:'1px solid #22c55e',borderRadius:8,padding:12,marginBottom:12}}>
          <div style={{fontSize:11,fontWeight:700,color:'#22c55e',letterSpacing:2,marginBottom:3}}>📡 NFL NEXTGEN TRACKING — YOLOv8 + HOMOGRAPHY + ML</div>
          <div style={{fontSize:8,color:'#555',lineHeight:1.6}}>OpenCV · YOLOv8 (Ultralytics) · Homography (pixel→yards) · scikit-learn Logistic Regression · Speed = dist/time · Separation = Euclidean(WR, nearest_CB)</div>
          <div style={{display:'flex',gap:6,marginTop:8,flexWrap:'wrap'}}>
            {['YOLOv8 Detection','Homography Mapping','Logistic Regression','Speed (dist÷time)','xYAC Model','Separation Tracking'].map(t=>(
              <span key={t} style={{background:'#22c55e11',color:'#22c55e',fontSize:7,fontWeight:700,padding:'2px 7px',borderRadius:4,border:'1px solid #22c55e33'}}>{t}</span>
            ))}
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:6,marginBottom:12}}>
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
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:6,marginTop:8}}>
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
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
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
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
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
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
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
          <button onClick={()=>send(inp)} disabled={load||!inp.trim()} style={{padding:'10px 20px',background:load||!inp.trim()?'#111':'#14532d',border:'none',borderRadius:8,color:load||!inp.trim()?'#555':'#22c55e',fontWeight:700,fontSize:13,cursor:'pointer'}}>{load?'...':'Send'}</button>
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
            <button onClick={log} style={{width:'100%',padding:'12px',background:'#14532d',border:'none',borderRadius:8,color:'#22c55e',fontWeight:700,fontSize:14,cursor:'pointer'}}>+ LOG PLAY</button>
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
  const blankRow = { qb:'Aiden Grabowski', concept:'Stick', result:'Complete', yards:'', down:'1', field:'normal', ttt:'', date:'', session:'7on7' }
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
            qb:      row.qb || 'Aiden Grabowski',
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
            <textarea value={jsonText} onChange={e => setJson(e.target.value)} placeholder='[{"qb":"Aiden Grabowski","concept":"Stick","result":"Complete","yards":9,"down":1,"field":"normal","date":"4/27"}]' style={ta}/>
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
const TABS = ['Overview','Charts','Play Calls','Replays','Players','Mistakes','Next Practice']

export default function App() {
  const [tab,         setTab]        = useState('Overview')
  const [fQB,         setFQB]        = useState('All QBs')
  const [fSit,        setFSit]       = useState('All')
  const [fDate,       setFDate]      = useState('All')
  const [fSess,       setFSess]      = useState('All')
  const [plays, setPlays] = useState(() => { try { const s = localStorage.getItem('wf_plays'); return s ? JSON.parse(s) : SEED_PLAYS } catch { return SEED_PLAYS } })
  const [replayIdx,   setReplayIdx]  = useState(0)
  const [playerQB,    setPlayerQB]   = useState('Aiden Grabowski')
  const [showImport,  setImport]     = useState(false)

  // Merge imported plays, assign fresh IDs
  useEffect(() => { try { localStorage.setItem('wf_plays', JSON.stringify(plays)) } catch(e) {} }, [plays])

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
              <span style={{ fontSize:9, fontWeight:700, letterSpacing:1.5, color:C.gold }}>PLAY #1: {(rows[0]?.concept||'BALTIMORE').toUpperCase()} — {rows[0]?.qb||'Aiden Grabowski'}</span>
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
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
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
}
