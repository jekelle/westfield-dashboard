import { useState, useMemo, useCallback, useRef } from 'react'
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
const SEED_PLAYS = [
  {
    "id": 1,
    "qb": "QB1",
    "concept": "Stick",
    "result": "Complete",
    "yards": 8,
    "down": 1,
    "field": "normal",
    "ttt": "1.6s",
    "date": "4/21",
    "session": "7on7"
  },
  {
    "id": 2,
    "qb": "QB1",
    "concept": "Stick",
    "result": "Complete",
    "yards": 6,
    "down": 2,
    "field": "normal",
    "ttt": "1.5s",
    "date": "4/21",
    "session": "7on7"
  },
  {
    "id": 3,
    "qb": "QB1",
    "concept": "Baltimore",
    "result": "Complete",
    "yards": 12,
    "down": 1,
    "field": "normal",
    "ttt": "1.8s",
    "date": "4/21",
    "session": "7on7"
  },
  {
    "id": 4,
    "qb": "QB1",
    "concept": "Sail",
    "result": "Incomplete",
    "yards": 0,
    "down": 3,
    "field": "redzone",
    "ttt": "2.4s",
    "date": "4/21",
    "session": "7on7"
  },
  {
    "id": 5,
    "qb": "QB1",
    "concept": "Out",
    "result": "Complete",
    "yards": 7,
    "down": 2,
    "field": "normal",
    "ttt": "1.7s",
    "date": "4/21",
    "session": "7on7"
  },
  {
    "id": 6,
    "qb": "QB1",
    "concept": "Fade",
    "result": "Incomplete",
    "yards": 0,
    "down": 3,
    "field": "redzone",
    "ttt": "2.2s",
    "date": "4/21",
    "session": "7on7"
  },
  {
    "id": 7,
    "qb": "QB1",
    "concept": "Post",
    "result": "Complete",
    "yards": 15,
    "down": 1,
    "field": "normal",
    "ttt": "2.1s",
    "date": "4/21",
    "session": "7on7"
  },
  {
    "id": 8,
    "qb": "QB1",
    "concept": "Slant",
    "result": "Complete",
    "yards": 5,
    "down": 2,
    "field": "normal",
    "ttt": "1.5s",
    "date": "4/21",
    "session": "7on7"
  },
  {
    "id": 9,
    "qb": "QB1",
    "concept": "Stick",
    "result": "Complete",
    "yards": 9,
    "down": 1,
    "field": "normal",
    "ttt": "1.6s",
    "date": "4/21",
    "session": "7on7"
  },
  {
    "id": 10,
    "qb": "QB1",
    "concept": "Out",
    "result": "Complete",
    "yards": 6,
    "down": 2,
    "field": "normal",
    "ttt": "1.8s",
    "date": "4/21",
    "session": "7on7"
  },
  {
    "id": 11,
    "qb": "QB2",
    "concept": "Stick",
    "result": "Complete",
    "yards": 9,
    "down": 1,
    "field": "normal",
    "ttt": "1.9s",
    "date": "4/21",
    "session": "7on7"
  },
  {
    "id": 12,
    "qb": "QB2",
    "concept": "Baltimore",
    "result": "Complete",
    "yards": 14,
    "down": 1,
    "field": "normal",
    "ttt": "2.0s",
    "date": "4/21",
    "session": "7on7"
  },
  {
    "id": 13,
    "qb": "QB2",
    "concept": "Sail",
    "result": "Incomplete",
    "yards": 0,
    "down": 3,
    "field": "redzone",
    "ttt": "2.6s",
    "date": "4/21",
    "session": "7on7"
  },
  {
    "id": 14,
    "qb": "QB2",
    "concept": "Out",
    "result": "Complete",
    "yards": 6,
    "down": 2,
    "field": "normal",
    "ttt": "1.7s",
    "date": "4/21",
    "session": "7on7"
  },
  {
    "id": 15,
    "qb": "QB2",
    "concept": "Fade",
    "result": "Incomplete",
    "yards": 0,
    "down": 3,
    "field": "redzone",
    "ttt": "2.3s",
    "date": "4/21",
    "session": "7on7"
  },
  {
    "id": 16,
    "qb": "QB2",
    "concept": "Post",
    "result": "Complete",
    "yards": 13,
    "down": 1,
    "field": "normal",
    "ttt": "2.1s",
    "date": "4/21",
    "session": "7on7"
  },
  {
    "id": 17,
    "qb": "QB2",
    "concept": "Slant",
    "result": "Complete",
    "yards": 6,
    "down": 2,
    "field": "normal",
    "ttt": "1.6s",
    "date": "4/21",
    "session": "7on7"
  },
  {
    "id": 18,
    "qb": "QB2",
    "concept": "Stick",
    "result": "Complete",
    "yards": 7,
    "down": 1,
    "field": "normal",
    "ttt": "1.8s",
    "date": "4/21",
    "session": "7on7"
  },
  {
    "id": 19,
    "qb": "QB2",
    "concept": "Out",
    "result": "Complete",
    "yards": 8,
    "down": 2,
    "field": "normal",
    "ttt": "1.9s",
    "date": "4/21",
    "session": "7on7"
  },
  {
    "id": 20,
    "qb": "QB2",
    "concept": "Sail",
    "result": "Incomplete",
    "yards": 0,
    "down": 3,
    "field": "redzone",
    "ttt": "2.5s",
    "date": "4/21",
    "session": "7on7"
  },
  {
    "id": 21,
    "qb": "QB3",
    "concept": "Stick",
    "result": "Complete",
    "yards": 7,
    "down": 1,
    "field": "normal",
    "ttt": "2.0s",
    "date": "4/21",
    "session": "7on7"
  },
  {
    "id": 22,
    "qb": "QB3",
    "concept": "Baltimore",
    "result": "Complete",
    "yards": 13,
    "down": 1,
    "field": "normal",
    "ttt": "2.2s",
    "date": "4/21",
    "session": "7on7"
  },
  {
    "id": 23,
    "qb": "QB3",
    "concept": "Sail",
    "result": "Incomplete",
    "yards": 0,
    "down": 3,
    "field": "redzone",
    "ttt": "2.8s",
    "date": "4/21",
    "session": "7on7"
  },
  {
    "id": 24,
    "qb": "QB3",
    "concept": "Out",
    "result": "Complete",
    "yards": 5,
    "down": 2,
    "field": "normal",
    "ttt": "1.9s",
    "date": "4/21",
    "session": "7on7"
  },
  {
    "id": 25,
    "qb": "QB3",
    "concept": "Fade",
    "result": "Incomplete",
    "yards": 0,
    "down": 3,
    "field": "redzone",
    "ttt": "2.4s",
    "date": "4/21",
    "session": "7on7"
  },
  {
    "id": 26,
    "qb": "QB3",
    "concept": "Post",
    "result": "Complete",
    "yards": 12,
    "down": 1,
    "field": "normal",
    "ttt": "2.3s",
    "date": "4/21",
    "session": "7on7"
  },
  {
    "id": 27,
    "qb": "QB3",
    "concept": "Slant",
    "result": "Complete",
    "yards": 4,
    "down": 2,
    "field": "normal",
    "ttt": "1.7s",
    "date": "4/21",
    "session": "7on7"
  },
  {
    "id": 28,
    "qb": "QB3",
    "concept": "Stick",
    "result": "Complete",
    "yards": 8,
    "down": 1,
    "field": "normal",
    "ttt": "1.9s",
    "date": "4/21",
    "session": "7on7"
  },
  {
    "id": 29,
    "qb": "QB3",
    "concept": "Out",
    "result": "Complete",
    "yards": 6,
    "down": 2,
    "field": "normal",
    "ttt": "2.0s",
    "date": "4/21",
    "session": "7on7"
  },
  {
    "id": 30,
    "qb": "QB3",
    "concept": "Sail",
    "result": "Incomplete",
    "yards": 0,
    "down": 3,
    "field": "redzone",
    "ttt": "2.7s",
    "date": "4/21",
    "session": "7on7"
  },
  {
    "id": 31,
    "qb": "QB1",
    "concept": "Stick",
    "result": "Complete",
    "yards": 8,
    "down": 1,
    "field": "normal",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 32,
    "qb": "QB1",
    "concept": "Stick",
    "result": "Complete",
    "yards": 6,
    "down": 2,
    "field": "normal",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 33,
    "qb": "QB1",
    "concept": "Baltimore",
    "result": "Complete",
    "yards": 12,
    "down": 1,
    "field": "normal",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 34,
    "qb": "QB1",
    "concept": "Sail",
    "result": "Incomplete",
    "yards": 0,
    "down": 3,
    "field": "redzone",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 35,
    "qb": "QB1",
    "concept": "Out",
    "result": "Complete",
    "yards": 7,
    "down": 2,
    "field": "normal",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 36,
    "qb": "QB1",
    "concept": "Post",
    "result": "Complete",
    "yards": 14,
    "down": 1,
    "field": "normal",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 37,
    "qb": "QB1",
    "concept": "Slant",
    "result": "Complete",
    "yards": 5,
    "down": 2,
    "field": "normal",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 38,
    "qb": "QB1",
    "concept": "Fade",
    "result": "Incomplete",
    "yards": 0,
    "down": 3,
    "field": "redzone",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 39,
    "qb": "QB2",
    "concept": "Stick",
    "result": "Complete",
    "yards": 9,
    "down": 1,
    "field": "normal",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 40,
    "qb": "QB2",
    "concept": "Baltimore",
    "result": "Complete",
    "yards": 13,
    "down": 1,
    "field": "normal",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 41,
    "qb": "QB2",
    "concept": "Sail",
    "result": "Incomplete",
    "yards": 0,
    "down": 3,
    "field": "redzone",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 42,
    "qb": "QB2",
    "concept": "Out",
    "result": "Complete",
    "yards": 6,
    "down": 2,
    "field": "normal",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 43,
    "qb": "QB2",
    "concept": "Post",
    "result": "Complete",
    "yards": 12,
    "down": 1,
    "field": "normal",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 44,
    "qb": "QB2",
    "concept": "Slant",
    "result": "Complete",
    "yards": 6,
    "down": 2,
    "field": "normal",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 45,
    "qb": "QB2",
    "concept": "Fade",
    "result": "Incomplete",
    "yards": 0,
    "down": 3,
    "field": "redzone",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 46,
    "qb": "QB3",
    "concept": "Stick",
    "result": "Complete",
    "yards": 7,
    "down": 1,
    "field": "normal",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 47,
    "qb": "QB3",
    "concept": "Baltimore",
    "result": "Complete",
    "yards": 12,
    "down": 1,
    "field": "normal",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 48,
    "qb": "QB3",
    "concept": "Sail",
    "result": "Incomplete",
    "yards": 0,
    "down": 3,
    "field": "redzone",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 49,
    "qb": "QB3",
    "concept": "Out",
    "result": "Complete",
    "yards": 5,
    "down": 2,
    "field": "normal",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 50,
    "qb": "QB3",
    "concept": "Post",
    "result": "Complete",
    "yards": 11,
    "down": 1,
    "field": "normal",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 51,
    "qb": "QB3",
    "concept": "Slant",
    "result": "Complete",
    "yards": 4,
    "down": 2,
    "field": "normal",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 52,
    "qb": "QB3",
    "concept": "Fade",
    "result": "Incomplete",
    "yards": 0,
    "down": 3,
    "field": "redzone",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 53,
    "qb": "QB1",
    "concept": "Stick",
    "result": "Complete",
    "yards": 10,
    "down": 1,
    "field": "normal",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 54,
    "qb": "QB1",
    "concept": "Baltimore",
    "result": "Complete",
    "yards": 13,
    "down": 1,
    "field": "normal",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 55,
    "qb": "QB1",
    "concept": "Out",
    "result": "Complete",
    "yards": 7,
    "down": 2,
    "field": "normal",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 56,
    "qb": "QB1",
    "concept": "Slant",
    "result": "Complete",
    "yards": 5,
    "down": 2,
    "field": "normal",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 57,
    "qb": "QB1",
    "concept": "Post",
    "result": "Complete",
    "yards": 16,
    "down": 1,
    "field": "normal",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 58,
    "qb": "QB1",
    "concept": "Sail",
    "result": "Incomplete",
    "yards": 0,
    "down": 3,
    "field": "redzone",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 59,
    "qb": "QB1",
    "concept": "Fade",
    "result": "Incomplete",
    "yards": 0,
    "down": 3,
    "field": "redzone",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 60,
    "qb": "QB2",
    "concept": "Stick",
    "result": "Complete",
    "yards": 8,
    "down": 1,
    "field": "normal",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 61,
    "qb": "QB2",
    "concept": "Slant",
    "result": "Complete",
    "yards": 6,
    "down": 2,
    "field": "normal",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 62,
    "qb": "QB1",
    "concept": "Baltimore",
    "result": "Complete",
    "yards": 11,
    "down": 1,
    "field": "normal",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 63,
    "qb": "QB1",
    "concept": "Out",
    "result": "Complete",
    "yards": 6,
    "down": 2,
    "field": "normal",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 64,
    "qb": "QB1",
    "concept": "Sail",
    "result": "Incomplete",
    "yards": 0,
    "down": 3,
    "field": "redzone",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 65,
    "qb": "QB1",
    "concept": "Post",
    "result": "Complete",
    "yards": 13,
    "down": 1,
    "field": "normal",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 66,
    "qb": "QB1",
    "concept": "Slant",
    "result": "Complete",
    "yards": 5,
    "down": 2,
    "field": "normal",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 67,
    "qb": "QB1",
    "concept": "Fade",
    "result": "Incomplete",
    "yards": 0,
    "down": 3,
    "field": "redzone",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 68,
    "qb": "QB2",
    "concept": "Stick",
    "result": "Complete",
    "yards": 8,
    "down": 1,
    "field": "normal",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 69,
    "qb": "QB2",
    "concept": "Baltimore",
    "result": "Complete",
    "yards": 12,
    "down": 1,
    "field": "normal",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 70,
    "qb": "QB2",
    "concept": "Out",
    "result": "Complete",
    "yards": 7,
    "down": 2,
    "field": "normal",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 71,
    "qb": "QB2",
    "concept": "Sail",
    "result": "Incomplete",
    "yards": 0,
    "down": 3,
    "field": "redzone",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 72,
    "qb": "QB2",
    "concept": "Post",
    "result": "Complete",
    "yards": 10,
    "down": 1,
    "field": "normal",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 73,
    "qb": "QB2",
    "concept": "Slant",
    "result": "Complete",
    "yards": 6,
    "down": 2,
    "field": "normal",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 74,
    "qb": "QB2",
    "concept": "Fade",
    "result": "Incomplete",
    "yards": 0,
    "down": 3,
    "field": "redzone",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 75,
    "qb": "QB3",
    "concept": "Stick",
    "result": "Complete",
    "yards": 6,
    "down": 1,
    "field": "normal",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 76,
    "qb": "QB3",
    "concept": "Baltimore",
    "result": "Complete",
    "yards": 11,
    "down": 1,
    "field": "normal",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 77,
    "qb": "QB3",
    "concept": "Out",
    "result": "Complete",
    "yards": 5,
    "down": 2,
    "field": "normal",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 78,
    "qb": "QB3",
    "concept": "Sail",
    "result": "Incomplete",
    "yards": 0,
    "down": 3,
    "field": "redzone",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 79,
    "qb": "QB3",
    "concept": "Post",
    "result": "Complete",
    "yards": 12,
    "down": 1,
    "field": "normal",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 80,
    "qb": "QB3",
    "concept": "Slant",
    "result": "Complete",
    "yards": 4,
    "down": 2,
    "field": "normal",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  },
  {
    "id": 81,
    "qb": "QB3",
    "concept": "Fade",
    "result": "Incomplete",
    "yards": 0,
    "down": 3,
    "field": "redzone",
    "ttt": "",
    "date": "4/27",
    "session": "7on7"
  }
]

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
  return ['QB1','QB2','QB3'].map(qb => {
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
      qb:      row.qb || 'QB1',
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
  const blankRow = { qb:'QB1', concept:'Stick', result:'Complete', yards:'', down:'1', field:'normal', ttt:'', date:'', session:'7on7' }
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
            qb:      row.qb || 'QB1',
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
                  {['QB1','QB2','QB3'].map(o=><option key={o}>{o}</option>)}
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
            <textarea value={jsonText} onChange={e => setJson(e.target.value)} placeholder='[{"qb":"QB1","concept":"Stick","result":"Complete","yards":9,"down":1,"field":"normal","date":"4/27"}]' style={ta}/>
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
  const [plays,       setPlays]      = useState(()=>{try{const s=localStorage.getItem("wf");return s?[...JSON.parse(s)]:SEED_PLAYS}catch{return SEED_PLAYS}})
  const [replayIdx,   setReplayIdx]  = useState(0)
  const [playerQB,    setPlayerQB]   = useState('QB1')
  const [showImport,  setImport]     = useState(false)

  // Merge imported plays, assign fresh IDs
  React.useEffect(()=>{try{localStorage.setItem("wf",JSON.stringify(plays))}catch(e){}},[plays])
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
    (fDate=== 'All'     || p.date   === fDate)
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
            {['All Segments','All Plays','All Results','All Sides','All Concepts','All Situations','All Looks','All Decision Speeds'].map(f =>
              <select key={f} style={{ ...selS, display:'block', width:'100%', marginBottom:4 }}><option>{f}</option></select>
            )}
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
              <span style={{ fontSize:9, fontWeight:700, letterSpacing:1.5, color:C.gold }}>PLAY #1: {(rows[0]?.concept||'BALTIMORE').toUpperCase()} — {rows[0]?.qb||'QB1'}</span>
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
    const byQB = ['QB1','QB2','QB3'].map(qb=>{const tot=rows.filter(p=>p.qb===qb),fail=incomplete.filter(p=>p.qb===qb);return{qb,fails:fail.length,pct:tot.length?Math.round(fail.length/tot.length*100):0}})
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
          <select value={fQB}   onChange={e=>setFQB(e.target.value)}   style={selS}>{['All QBs','QB1','QB2','QB3'].map(o=><option key={o}>{o}</option>)}</select>
          <select value={fSit}  onChange={e=>setFSit(e.target.value)}  style={selS}>{[['All','All Situations'],['normal','Normal'],['redzone','Redzone']].map(([v,l])=><option key={v} value={v}>{l}</option>)}</select>
          <select value={fDate} onChange={e=>setFDate(e.target.value)} style={selS}>{dates.map(d=><option key={d} value={d}>{d==='All'?'All Dates':d}</option>)}</select>
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
