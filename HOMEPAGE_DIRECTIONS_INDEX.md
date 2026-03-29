# Homepage Design Directions

Four distinct design directions for the Intelligent Project homepage. Each direction offers a unique visual identity while maintaining alignment with the brand values: professional, exclusive, modern.

---

## Quick Comparison

| Direction | Visual Impact | Complexity | Mobile-Friendly | Unique Hook |
|-----------|---------------|------------|-----------------|-------------|
| [A: Split-Persona](./HOMEPAGE_DIRECTION_A_SPLIT_PERSONA.md) | High | Medium | Good | Dynamic vertical divide |
| [B: Orbiting Projects](./HOMEPAGE_DIRECTION_B_ORBITING_PROJECTS.md) | Very High | High | Moderate | 3D orbit rotation |
| [C: Vertical Theatre](./HOMEPAGE_DIRECTION_C_VERTICAL_THEATRE.md) | High | Medium-High | Good | Scene transitions |
| [D: Magnetic Cursor](./HOMEPAGE_DIRECTION_D_MAGNETIC_CURSOR_FIELD.md) | Very High | High | Challenging | Physics interaction |

---

## Direction A: Split-Persona

**Concept**: A dramatic vertical split dividing strategy (dark, left) from visuals (light, right). The split line moves on scroll, creating dynamic reveals.

**Best For**: Agencies wanting to emphasize the duality of their work — strategic thinking + visual execution.

**Key Animations**:
- Split line animates from left on load
- Text reveals from behind the divide
- Projects slide in, clipped by the split

**File**: [HOMEPAGE_DIRECTION_A_SPLIT_PERSONA.md](./HOMEPAGE_DIRECTION_A_SPLIT_PERSONA.md)

---

## Direction B: Orbiting Projects

**Concept**: Projects orbit around a central logo point. Scroll controls rotation speed. Hover pauses and scales. 3D perspective depth.

**Best For**: Agencies wanting a memorable, interactive experience that showcases multiple projects equally.

**Key Animations**:
- Projects fly in from edges, settle into orbit
- Scroll velocity controls rotation
- Hover pauses orbit, scales project

**File**: [HOMEPAGE_DIRECTION_B_ORBITING_PROJECTS.md](./HOMEPAGE_DIRECTION_B_ORBITING_PROJECTS.md)

---

## Direction C: Vertical Theatre

**Concept**: Each scroll is a scene change. Full-viewport sections with theatrical animations. Text that disintegrates, cards that flip in with 3D perspective.

**Best For**: Agencies wanting a narrative-driven experience where each section feels like a performance.

**Key Animations**:
- Hero text scatters into particles on scroll
- Manifesto types itself with scramble effect
- Projects flip in with 3D rotation

**File**: [HOMEPAGE_DIRECTION_C_VERTICAL_THEATRE.md](./HOMEPAGE_DIRECTION_C_VERTICAL_THEATRE.md)

---

## Direction D: Magnetic Cursor Field

**Concept**: Project cards exist in a magnetic field. Cursor creates attraction/repulsion. Cards have physics-like behavior with spring snap-back.

**Best For**: Agencies wanting an interactive, playful experience that responds to user input.

**Key Animations**:
- Cursor position affects card positions
- Cards push away/ attract toward cursor
- Spring physics snap-back on mouse leave

**File**: [HOMEPAGE_DIRECTION_D_MAGNETIC_CURSOR_FIELD.md](./HOMEPAGE_DIRECTION_D_MAGNETIC_CURSOR_FIELD.md)

---

## Implementation

To switch between directions, update `src/app/page.tsx`:

```typescript
// Direction A
import HomepageSplit from "./components/HomepageSplit/HomepageSplit";

// Direction B
import HomepageOrbit from "./components/HomepageOrbit/HomepageOrbit";

// Direction C
import HomepageTheatre from "./components/HomepageTheatre/HomepageTheatre";

// Direction D
import HomepageMagnetic from "./components/HomepageMagnetic/HomepageMagnetic";

export default function Home() {
  return <HomepageTheatre />; // Change this line
}
```

---

## Technical Requirements

All directions use:
- **Next.js 15** (App Router)
- **React 19**
- **GSAP 3** with ScrollTrigger
- **SCSS Modules**
- **TypeScript**

Additional plugins:
- Direction C requires `gsap/ScrambleTextPlugin`

---

## Mobile Considerations

| Direction | Mobile Behavior |
|-----------|-----------------|
| A: Split-Persona | Stacks vertically, split becomes horizontal divider |
| B: Orbiting | Projects grid, orbit disabled |
| C: Vertical Theatre | Full support, simplified animations |
| D: Magnetic | Standard grid, magnetic effect disabled |

---

## Recommendation

**Start with Direction C (Vertical Theatre)** for the best balance of visual impact and implementation complexity.

Consider **Direction A (Split-Persona)** for a unique visual identity that's easier to implement.

Try **Direction B (Orbiting)** if you want maximum visual impact and have time for complex implementation.

Use **Direction D (Magnetic)** if your audience is primarily desktop users who will appreciate the interactive physics.
