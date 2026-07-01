with open('src/App.jsx', 'r') as f:
    src = f.read()

if 'Hairston' in src:
    print("Hairston already in file — nothing to do.")
    exit(0)

# Add a placeholder row to each tab's recv array so he shows up in the table
# Structure matches GmPlayerRow — tgt:0 means "not tracked" display
HOBART_ROW = "{name:'Hairston',num:'34',pos:'TE',tgt:0,rec:0,cryd:0,expl:0}"
OPL_ROW    = "{name:'Hairston',num:'34',pos:'TE',tgt:0,rec:0,cryd:0,expl:0}"
LJ_ROW     = "{name:'Hairston',num:'34',pos:'TE',tgt:0,rec:0,cryd:0,expl:0}"

# Each tab ends its recv array with Vollmer or Everts as last entry
# Insert Hairston as the last entry before the closing ]
import re

def insert_into_recv(src, tab_marker, new_row):
    # Find the recv array inside the specific tab function
    tab_idx = src.index(tab_marker)
    recv_start = src.index('const recv=[', tab_idx)
    recv_end = src.index(']', recv_start)
    # Insert new row before the closing bracket
    src = src[:recv_end] + ',' + new_row + src[recv_end:]
    return src

src = insert_into_recv(src, 'function HobartTab()', HOBART_ROW)
print("✓ Added Hairston to HobartTab recv")

src = insert_into_recv(src, 'function OPlaylistTab()', OPL_ROW)
print("✓ Added Hairston to OPlaylistTab recv")

src = insert_into_recv(src, 'function LJTab()', LJ_ROW)
print("✓ Added Hairston to LJTab recv")

# Also update GmPlayerRow to show '—' for 0 stats (not tracked indicator)
# The existing logic already shows '—' for null, but 0 would show 0
# Add a note row after each RecTbl
NOTE = "<div style={{fontSize:8,color:'#f97316',marginTop:5,paddingLeft:2,fontStyle:'italic'}}>* Hairston #34 (TE) — stats not yet tracked; worn #62 in practice film</div>"
src = src.replace('<RecTbl players={recv}/>', f'<RecTbl players={{recv}}/>{NOTE}')
count = src.count('stats not yet tracked')
print(f"✓ Added tracking note to {count} tab(s)")

with open('src/App.jsx', 'w') as f:
    f.write(src)

print("\n✅ Done — run: git add . && git commit -m 'Add Hairston #34 TE to all film tabs' && git push")
