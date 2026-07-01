with open('src/App.jsx', 'r') as f:
    src = f.read()

# Remove the existing note-only approach from patch_hairston.py
src = src.replace(
    "<RecTbl players={recv}/><div style={{fontSize:8,color:'#69758a',marginTop:6,fontStyle:'italic',paddingLeft:4}}>* Aiden Hairston #34 (TE) active — stats not tracked (wore #62 in practice film)</div>",
    "<RecTbl players={recv}/>"
)
# Also remove the orange note version if present
src = src.replace(
    "<RecTbl players={recv}/><div style={{fontSize:8,color:'#f97316',marginTop:5,paddingLeft:2,fontStyle:'italic'}}>* Hairston #34 (TE) — stats not yet tracked; worn #62 in practice film</div>",
    "<RecTbl players={recv}/>"
)
print("✓ Cleaned old notes")

# Now properly insert Hairston into each recv array as a real row
HAIRSTON_ROW = "{name:'Hairston',num:'34',pos:'TE',tgt:0,rec:0,cryd:0,expl:0}"

def insert_hairston(src, func_name):
    idx = src.index(func_name)
    recv_idx = src.index('const recv=[', idx)
    close_idx = src.index(']', recv_idx)
    if HAIRSTON_ROW not in src[recv_idx:close_idx+1]:
        src = src[:close_idx] + ',' + HAIRSTON_ROW + src[close_idx:]
    return src

src = insert_hairston(src, 'function HobartTab()')
src = insert_hairston(src, 'function OPlaylistTab()')
src = insert_hairston(src, 'function LJTab()')
print("✓ Added Hairston as table row in all 3 tabs")

# Update GmPlayerRow to show NT for 0 stats
# When tgt===0 show — instead of 0
old = "const ct=tgt?Math.round(rec/tgt*100):null"
new = "const ct=tgt&&tgt>0?Math.round(rec/tgt*100):null"
src = src.replace(old, new, 1)

# Also show NT badge when tgt===0
old_td = "{tgt!==null&&<><td style={{padding:'6px 4px',fontSize:9,fontWeight:700,color:'#06b6d4',textAlign:'center'}}>{tgt}</td>"
new_td = "{tgt!==null&&<><td style={{padding:'6px 4px',fontSize:9,fontWeight:700,color:'#06b6d4',textAlign:'center'}}>{tgt===0?<span style={{fontSize:7,color:'#f97316',fontWeight:700}}>NT</span>:tgt}</td>"
src = src.replace(old_td, new_td, 1)
print("✓ Updated row renderer for NT display")

with open('src/App.jsx', 'w') as f:
    f.write(src)

print("\n✅ Done — run: git add . && git commit -m 'Fix Hairston display as table row' && git push")
