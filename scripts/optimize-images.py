"""Create responsive WebP copies. Originals remain available as fallbacks."""
from pathlib import Path
from PIL import Image, ImageOps

directory = Path(__file__).resolve().parents[1] / 'assets' / 'images'
original_bytes = 0
optimized_bytes = 0
for source in sorted(directory.glob('*.jpg')):
    original_bytes += source.stat().st_size
    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image).convert('RGB')
        for suffix, width in [('', 1376), ('-640', 640)]:
            copy = image.copy()
            copy.thumbnail((width, 2000), Image.Resampling.LANCZOS)
            target = source.with_name(source.stem + suffix + '.webp')
            copy.save(target, 'WEBP', quality=82, method=6)
            if not suffix:
                optimized_bytes += target.stat().st_size
print(f'Full-size images: {original_bytes:,} -> {optimized_bytes:,} bytes '
      f'({1-optimized_bytes/original_bytes:.0%} smaller); 640px variants also generated.')
