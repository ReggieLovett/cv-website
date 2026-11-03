'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Award,
  Cpu,
  LayoutGrid,
  Maximize2,
  Mic,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { credentialCategories, credentials, type Credential } from '@/data/portfolio';
import { play } from '@/lib/sounds';
import { CertificateModal } from './certificate-modal';
import styles from './certificate-inventory.module.css';

/**
 * CertificateInventory — the /certificates index, laid out like an
 * open-world game's inventory screen.
 *
 * Category tabs run along the top, every credential sits in a square slot
 * under a bracket cursor, and whatever the cursor is on gets a preview and a
 * description band. It is the layout and the feel that is borrowed; every
 * icon, shape, and word is the site's own, and the content is
 * data/portfolio.ts.
 *
 * ---- "All" comes first ----
 * The index used to put every credential on one scroll because tabs hid two
 * thirds of the set behind a click. The first tab is the whole set, so the
 * page still opens on everything; the categories narrow it, they never hide
 * anything by default.
 *
 * ---- Selection is a click, not a hover ----
 * The detail band sits beside the grid, so hover-to-select would change the
 * item every time the pointer crossed a row on its way to the band's links.
 * Hover only brightens a slot; a click or an arrow key moves the cursor, and
 * Enter (or the band's button) opens the full record in CertificateModal.
 *
 * ---- Motion ----
 * Moving the cursor and switching category are instant — keyboard actions
 * repeated dozens of times a visit, where any travel would make the grid lag
 * the hand. The only ambient motion is the cursor's slow breathe, which is how
 * the eye finds it. The grid is a listbox with `aria-activedescendant`, so a
 * screen reader hears each credential as the cursor lands on it.
 */

type Tab = { id: string; label: string; icon: LucideIcon; items: Credential[] };

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Technical: Cpu,
  Leadership: Users,
  Seminars: Mic,
};

const TABS: Tab[] = [
  { id: 'all', label: 'All credentials', icon: LayoutGrid, items: credentials },
  ...credentialCategories
    .map((category) => ({
      id: category.toLowerCase(),
      label: category,
      icon: CATEGORY_ICONS[category] ?? Award,
      items: credentials.filter((item) => item.category === category),
    }))
    .filter((tab) => tab.items.length > 0),
];

/** Grid geometry from tablet up: five across, never fewer than four rows on desktop. */
const COLUMNS = 5;
const MIN_SLOTS = COLUMNS * 4;

/** How many empty slots to draw, and how many of them only finish the last row. */
function emptySlots(count: number): { total: number; rowFill: number } {
  return {
    total: Math.max(MIN_SLOTS, Math.ceil(count / COLUMNS) * COLUMNS) - count,
    rowFill: (COLUMNS - (count % COLUMNS)) % COLUMNS,
  };
}

const yearOf = (item: Credential) => item.date.match(/\d{4}/)?.[0];

/** The layout breakpoint below which the detail band stacks under the grid. */
const STACKED = '(max-width: 1023px)';

function isPlainKey(event: React.KeyboardEvent): boolean {
  return !event.metaKey && !event.ctrlKey && !event.altKey;
}

export function CertificateInventory() {
  const [tab, setTab] = useState(0);
  // The cursor position is remembered per category, as a game's is.
  const [picks, setPicks] = useState<number[]>(() => TABS.map(() => 0));
  const [open, setOpen] = useState<Credential | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const moved = useRef(false);
  const id = useId();

  const current = TABS[tab];
  const index = Math.min(picks[tab], current.items.length - 1);
  const item = current.items[index];
  const empty = emptySlots(current.items.length);
  const prev = (tab - 1 + TABS.length) % TABS.length;
  const next = (tab + 1) % TABS.length;
  const ItemIcon = item ? (CATEGORY_ICONS[item.category] ?? Award) : Award;

  const tabId = (i: number) => `${id}-tab-${i}`;
  const optionId = (i: number) => `${id}-item-${tab}-${i}`;
  const listId = `${id}-list`;

  // The inventory voices its own moves (`data-sound="own"` keeps the site's
  // delegated listener out), pointer and keyboard alike: a glassy cursor tap
  // per slot, an airy swish per category, and the two-stage confirm when a
  // credential opens (CertificateModal). Only real moves sound — the cursor
  // here moves on a click or an arrow, so hovering a slot stays silent.
  const selectTab = useCallback(
    (target: number) => {
      const wrapped = (target + TABS.length) % TABS.length;
      if (wrapped === tab) return;
      play('page');
      moved.current = true;
      setTab(wrapped);
    },
    [tab],
  );

  const pick = useCallback(
    (target: number, { silent = false } = {}) => {
      const clamped = Math.max(0, Math.min(current.items.length - 1, target));
      if (clamped === index) return;
      if (!silent) play('cursor');
      moved.current = true;
      setPicks((all) => {
        const copy = all.slice();
        copy[tab] = clamped;
        return copy;
      });
    },
    [current.items.length, index, tab],
  );

  // A new category starts at the top of its grid.
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = 0;
  }, [tab]);

  // Keep the cursor's slot inside the grid's scroll window — but only once
  // the reader has moved it, so arriving on the page never scrolls it.
  useEffect(() => {
    if (!moved.current) return;
    document.getElementById(`${id}-item-${tab}-${index}`)?.scrollIntoView({ block: 'nearest' });
  }, [id, tab, index]);

  const onListKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const list = listRef.current;
    const columns = list
      ? getComputedStyle(list).gridTemplateColumns.split(' ').filter(Boolean).length || 1
      : 1;
    const last = current.items.length - 1;
    let target: number | null = null;

    switch (event.key) {
      case 'ArrowRight':
        target = index + 1;
        break;
      case 'ArrowLeft':
        target = index - 1;
        break;
      case 'ArrowDown':
        // Into a short last row, land on its final item rather than stopping.
        target =
          index + columns <= last
            ? index + columns
            : Math.floor(index / columns) < Math.floor(last / columns)
              ? last
              : index;
        break;
      case 'ArrowUp':
        target = index - columns >= 0 ? index - columns : index;
        break;
      case 'Home':
        target = 0;
        break;
      case 'End':
        target = last;
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (item) setOpen(item);
        return;
      default:
        return;
    }
    event.preventDefault();
    pick(target);
  };

  // Q and E change category from anywhere inside the inventory, as the
  // shoulder buttons do — but only here, never as page-wide shortcuts.
  const onInventoryKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
    // The viewer portals out of this tree, but React still bubbles its key
    // events here — the grid behind an open certificate must stay put.
    if (open || !isPlainKey(event)) return;
    const key = event.key.toLowerCase();
    if (key !== 'q' && key !== 'e') return;
    event.preventDefault();
    selectTab(tab + (key === 'e' ? 1 : -1));
  };

  const onTabsKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const target = (tab + (event.key === 'ArrowRight' ? 1 : -1) + TABS.length) % TABS.length;
    selectTab(target);
    document.getElementById(tabId(target))?.focus();
  };

  return (
    <div className={styles.inventory} data-sound="own" onKeyDown={onInventoryKey}>
      <div className={styles.body}>
        {/* ===== The pack: categories over the slot grid ================ */}
        <section className={styles.pack} aria-label="Credentials">
          <p className={`tag ${styles.catLabel}`} aria-hidden="true">
            {current.label}
          </p>

          <div className={styles.cats}>
            <button
              type="button"
              onClick={() => selectTab(prev)}
              aria-label={`Previous category: ${TABS[prev].label}`}
              className={styles.step}
            >
              <kbd>Q</kbd>
            </button>

            <div role="tablist" aria-label="Categories" className={styles.tabs} onKeyDown={onTabsKey}>
              {TABS.map((entry, i) => {
                const Icon = entry.icon;
                return (
                  <button
                    key={entry.id}
                    type="button"
                    role="tab"
                    id={tabId(i)}
                    aria-selected={i === tab}
                    aria-controls={listId}
                    tabIndex={i === tab ? 0 : -1}
                    title={`${entry.label} (${entry.items.length})`}
                    onClick={() => selectTab(i)}
                    className={styles.tab}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                    <span className="sr-only">
                      {entry.label}, {entry.items.length}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => selectTab(next)}
              aria-label={`Next category: ${TABS[next].label}`}
              className={styles.step}
            >
              <kbd>E</kbd>
            </button>
          </div>

          <div
            ref={listRef}
            id={listId}
            role="listbox"
            aria-labelledby={tabId(tab)}
            aria-activedescendant={item ? optionId(index) : undefined}
            tabIndex={0}
            onKeyDown={onListKey}
            className={styles.grid}
          >
            {current.items.map((entry, i) => (
              <div
                key={entry.id}
                id={optionId(i)}
                role="option"
                aria-selected={i === index}
                aria-label={`${entry.title}, ${entry.issuer}`}
                data-scrim={entry.image ? '' : undefined}
                onClick={() => {
                  // Below the desktop layout the detail band sits under the
                  // whole grid, off screen — a tap there opens the full record
                  // instead of changing something the reader cannot see, and
                  // only the confirm sounds, not a cursor tap under it.
                  const stacked = window.matchMedia(STACKED).matches;
                  pick(i, { silent: stacked });
                  if (stacked) setOpen(entry);
                  else listRef.current?.focus({ preventScroll: true });
                }}
                // A second press on the slot under the cursor opens it, the
                // way confirming an item does.
                onDoubleClick={() => setOpen(entry)}
                className={styles.slot}
              >
                <span className={styles.slotArt}>
                  {entry.image ? (
                    <Image
                      src={entry.image}
                      alt=""
                      fill
                      sizes="96px"
                      className={
                        entry.kind === 'Badge' ? 'object-contain p-1.5' : 'object-cover object-top'
                      }
                    />
                  ) : (
                    <Award className={styles.slotGlyph} strokeWidth={1.25} aria-hidden="true" />
                  )}
                </span>
                {yearOf(entry) && (
                  <span className={styles.badge} aria-hidden="true">
                    {yearOf(entry)}
                  </span>
                )}
                {entry.verifyUrl && <span className={styles.mark} aria-hidden="true" />}
              </div>
            ))}
            {/* Empty slots fill the pack out to whole rows, the room it has
                left. Which ones show at which width is CSS — see `.empty`. */}
            {Array.from({ length: empty.total }, (_, i) => (
              <span
                key={`empty-${i}`}
                className={styles.empty}
                data-row-fill={i < empty.rowFill ? '' : undefined}
                aria-hidden="true"
              />
            ))}
          </div>
        </section>

        {/* ===== The detail: preview stage and description band ========== */}
        {item && (
          <section className={styles.detail} aria-label="Selected credential">
            <div className={styles.hold}>
              <span className="tag">Item</span>
              <p className={styles.holdCount}>
                <span className="text-bone">{index + 1}</span>
                <span className="text-faint"> / {current.items.length}</span>
              </p>
            </div>

            {/* Keyed per item: an <img> whose src changes keeps painting the
                old picture until the new one decodes, which put one
                certificate under another's name. A fresh element starts empty. */}
            <button
              type="button"
              onClick={() => setOpen(item)}
              aria-label={`View ${item.title} full size`}
              className={styles.stage}
            >
              {item.image ? (
                <Image
                  key={item.id}
                  src={item.image}
                  alt=""
                  fill
                  sizes="(max-width: 1023px) 90vw, 32rem"
                  className="object-contain p-4"
                />
              ) : (
                <Award className={styles.stageGlyph} strokeWidth={1.25} aria-hidden="true" />
              )}
            </button>

            <div className={styles.band}>
              <h2 className={styles.name}>{item.title}</h2>

              <div className={styles.metaRow}>
                <span className={styles.metaIcon} aria-hidden="true">
                  <ItemIcon className="h-3.5 w-3.5" strokeWidth={1.5} />
                </span>
                <p className="tag line-1">
                  {item.kind} · {item.issuer} · {item.date}
                </p>
              </div>

              {item.summary && <p className={styles.desc}>{item.summary}</p>}
              {item.credentialNo && (
                <p className="tag mt-3 text-faint">No. {item.credentialNo}</p>
              )}

              <div className={styles.actions}>
                <button
                  type="button"
                  onClick={() => setOpen(item)}
                  aria-haspopup="dialog"
                  className="action readout"
                >
                  View certificate
                  <span className="action__well" aria-hidden="true">
                    <Maximize2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </span>
                </button>
                {item.verifyUrl && (
                  <a
                    data-sound="select"
                    href={item.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action readout"
                    aria-label={`Verify ${item.title} (opens in a new tab)`}
                  >
                    Verify
                    <span className="action__well" aria-hidden="true">
                      <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </span>
                  </a>
                )}
                {item.verifyUrl && (
                  <span className={`tag ${styles.markLabel}`}>
                    <span className={styles.markDot} aria-hidden="true" />
                    Verifiable
                  </span>
                )}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Key hints, for a pointer-and-keyboard reader only. */}
      <footer className={styles.foot} aria-hidden="true">
        <span className={styles.hint}>
          <kbd>
            <ArrowLeft strokeWidth={1.75} />
          </kbd>
          <kbd>
            <ArrowRight strokeWidth={1.75} />
          </kbd>
          <kbd>
            <ArrowUp strokeWidth={1.75} />
          </kbd>
          <kbd>
            <ArrowDown strokeWidth={1.75} />
          </kbd>
          <span className="tag">Move</span>
        </span>
        <span className={styles.hint}>
          <kbd>Q</kbd>
          <kbd>E</kbd>
          <span className="tag">Category</span>
        </span>
        <span className={styles.hint}>
          <kbd>Enter</kbd>
          <span className="tag">View</span>
        </span>
      </footer>

      <CertificateModal item={open} onClose={() => setOpen(null)} />
    </div>
  );
}
