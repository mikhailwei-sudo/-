from PIL import Image, ImageDraw, ImageFilter
import random, os, math
S=96
atlas=Image.new("RGBA",(S*8,S*2))
for variant in range(8):
 r=random.Random(8431+variant*113)
 tile=Image.new("RGBA",(S,S),(25,27,39,255));d=ImageDraw.Draw(tile)
 # Worn irregular stone slabs with deep grout and scattered moss.
 for row in range(7):
  y=row*15-5
  x=-18 if row%2 else -2
  while x<S:
   w=r.randint(22,35);h=r.randint(12,16)
   base=r.choice([(105,93,92),(115,100,99),(121,105,101),(94,91,99),(111,99,108)])
   d.rounded_rectangle((x+1,y+1,x+w-2,y+h-2),radius=3,fill=base,outline=(48,48,61),width=2)
   d.line((x+4,y+3,x+w-6,y+3),fill=(158,139,133),width=2)
   for k in range(7):
    xx=x+r.randrange(4,max(5,w-3));yy=y+r.randrange(4,max(5,h-3))
    d.point((xx,yy),fill=r.choice([(62,67,65),(168,130,123),(80,91,78),(139,115,117)]))
   x+=w
 for k in range(75):
  x=r.randrange(S);y=r.randrange(S)
  c=r.choice([(50,89,70),(62,107,77),(135,91,104),(185,117,132)])
  d.ellipse((x,y,x+r.randrange(1,4),y+r.randrange(1,4)),fill=c)
 atlas.paste(tile,(variant*S,0))
for variant in range(8):
 r=random.Random(9121+variant*131)
 tile=Image.new("RGBA",(S,S),(12,26,34,255));d=ImageDraw.Draw(tile)
 d.rectangle((0,73,S,S),fill=(14,36,36))
 for layer in range(3):
  for k in range(85):
   x=r.randrange(-9,S+5);y=r.randrange(-7,83)
   rad=r.randrange(5,15)
   c=r.choice([(23,66,51),(31,83,55),(38,99,60),(48,113,64),(62,132,70),(76,146,75)])
   d.ellipse((x-rad,y-rad//2,x+rad,y+rad//2+5),fill=c)
   d.arc((x-rad,y-rad//2,x+rad,y+rad//2+5),190,320,fill=(102,155,85),width=2)
 for k in range(58):
  x=r.randrange(3,93);y=r.randrange(4,82)
  if r.random()<.45:
   d.ellipse((x-3,y-2,x+3,y+2),fill=r.choice([(242,131,155),(255,166,181),(233,180,99)]))
   d.ellipse((x-1,y-1,x+1,y+1),fill=(255,219,133))
  else:d.line((x,y,x+4,y-2),fill=(109,171,89),width=2)
 d.rectangle((0,90,S,95),fill=(10,25,33))
 atlas.paste(tile,(variant*S,S))
os.makedirs("game-assets",exist_ok=True)
atlas.save("game-assets/tea-garden-tiles.png",optimize=True)
print("Generated",atlas.size)
