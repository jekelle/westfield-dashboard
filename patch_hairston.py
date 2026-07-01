with open('src/App.jsx', 'r') as f:
    src = f.read()

NOTE = "<div style={{fontSize:8,color:'#69758a',marginTop:6,fontStyle:'italic',paddingLeft:4}}>* Aiden Hairston #34 (TE) active — stats not tracked (wore #62 in practice film)</div>"

# Add note after each RecTbl in the 3 game tabs
count = 0
search = "<RecTbl players={recv}/>"
new_str = f"<RecTbl players={{recv}}/>{NOTE}"

# Only replace inside the 3 tab functions (all 3 have identical pattern)
src = src.replace(search, new_str)
count = src.count("Hairston #34")
print(f"✓ Added Hairston note to {count} tab(s)")

with open('src/App.jsx', 'w') as f:
    f.write(src)

print("✅ Done — run: git add . && git commit -m 'Add Hairston #34 TE note' && git push")
