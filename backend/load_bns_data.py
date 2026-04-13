"""
load_bns_data.py — Load and validate BNS sections from CSV.
"""

import csv
import logging
from pathlib import Path

logger = logging.getLogger(__name__)


def load_bns_csv(filepath: str | Path) -> list[dict]:
    """
    Parse the BNS law CSV and return a list of section dicts.

    Each dict contains:
        section, subsection, cause, effect, text (formatted chunk for embedding)

    Rows with an empty 'Section' column are skipped.
    Raises FileNotFoundError if the CSV path does not exist.
    """
    filepath = Path(filepath)
    if not filepath.exists():
        raise FileNotFoundError(f"CSV not found: {filepath}")

    sections: list[dict] = []

    with open(filepath, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)

        for line_no, row in enumerate(reader, start=2):   # 2 = first data row
            section = row.get("Section", "").strip()
            if not section:
                continue

            # Build the text chunk that will be embedded & retrieved
            parts = {
                "Section":     section,
                "Subsection":  row.get("Subsection", "").strip(),
                "Cause":       row.get("Cause", "").strip(),
                "Explanation": row.get("Explanation", "").strip(),
                "Illustration":row.get("Illustration ", "").strip(),  # note trailing space in CSV header
                "Effect":      row.get("Effect", "").strip(),
            }

            # Skip rows that carry no real content beyond the section number
            meaningful = any(
                parts[k] for k in ("Cause", "Explanation", "Effect")
            )
            if not meaningful:
                logger.debug("Skipping content-empty row at line %d (section %s)", line_no, section)
                continue

            text_lines = [f"{k}: {v}" for k, v in parts.items() if v]
            text = "\n".join(text_lines)

            sections.append({
                "section":    parts["Section"],
                "subsection": parts["Subsection"],
                "cause":      parts["Cause"],
                "effect":     parts["Effect"],
                "text":       text,
            })

    logger.info("Loaded %d BNS sections from %s", len(sections), filepath)
    return sections


if __name__ == "__main__":
    import sys
    from config import CSV_PATH

    logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
    data = load_bns_csv(CSV_PATH)
    print(f"✅ Loaded {len(data)} BNS sections")
    if data:
        print("\nFirst section preview:")
        print(data[0]["text"])
