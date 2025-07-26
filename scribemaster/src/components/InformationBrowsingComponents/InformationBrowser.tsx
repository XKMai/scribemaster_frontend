import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  BookOpen,
  Users,
  Scroll,
  Sparkles,
  Sword,
  Star,
} from "lucide-react";
import backgrounds from "./Data/backgrounds.json";
import races from "./Data/races.json";
import feats from "./Data/feats.json";
import spells from "./Data/spells.json";
import classes from "./Data/classes.json";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const mockData = {
  backgrounds: backgrounds,
  races: races,
  feats: feats,
  spells: spells,
  classes: classes,
};

// Mock data based on your examples
// const mockData = {
//   backgrounds: [
//     {
//       name: "Acolyte",
//       source: "PHB",
//       page: 127,
//       srd: true,
//       basicRules: true,
//       skillProficiencies: [
//         {
//           insight: true,
//           religion: true,
//         },
//       ],
//       languageProficiencies: [
//         {
//           anyStandard: 2,
//         },
//       ],
//       startingEquipment: [
//         {
//           _: [
//             {
//               item: "holy symbol",
//               displayName:
//                 "holy symbol (a gift to you when you entered the priesthood)",
//             },
//             {
//               special: "sticks of incense",
//               quantity: 5,
//             },
//             {
//               special: "vestments",
//             },
//             "common clothes",
//             {
//               item: "pouch",
//               containsValue: 1500,
//             },
//           ],
//         },
//       ],
//       entries:
//         "- **Skill Proficiencies:** Insight, Religion\n- **Languages:** Two of your choice\n- **Equipment:** A holy symbol (a gift to you when you entered the priesthood), a prayer book or prayer wheel, 5 sticks of incense, vestments, a set of common clothes, and a belt pouch containing 15 gp\n\n### Feature: Shelter of the Faithful\n\nAs an acolyte, you command the respect of those who share your faith...",
//       feature: "Shelter of the Faithful",
//     },
//   ],
//   races: [
//     {
//       name: "Aarakocra",
//       source: "EEPC",
//       page: 5,
//       size: ["M"],
//       speed: {
//         walk: 25,
//         fly: 50,
//       },
//       abilityBonuses: [
//         {
//           dex: 2,
//           wis: 1,
//         },
//       ],
//       traitTags: ["Natural Weapon"],
//       languageProficiencies: [
//         {
//           common: true,
//           other: true,
//           auran: true,
//         },
//       ],
//       age: {
//         mature: 3,
//         max: 30,
//       },
//       entries:
//         "### Age\n\nAarakocra reach maturity by age 3. Compared to humans, aarakocra don't usually live longer than 30 years.\n\n### Alignment\n\nMost aarakocra are good and rarely choose sides when it comes to law and chaos.\n\n### Size\n\nAarakocra are about 5 feet tall. They have thin, lightweight bodies that weigh between 80 and 100 pounds. Your size is Medium.\n\n### Flight\n\nYou have a flying speed of 50 feet. To use this speed, you can't be wearing medium or heavy armor.\n\n### Talons\n\nYour talons are natural weapons, which you can use to make unarmed strikes.",
//     },
//   ],
//   spells: [
//     {
//       name: "Antagonize",
//       source: "BMT",
//       level: 3,
//       school: "E",
//       ritual: false,
//       time: [
//         {
//           number: 1,
//           unit: "action",
//         },
//       ],
//       range: {
//         type: "point",
//         distance: {
//           type: "feet",
//           amount: 30,
//         },
//       },
//       duration: [
//         {
//           type: "instant",
//         },
//       ],
//       components: {
//         v: true,
//         s: true,
//         m: "a playing card depicting a rogue",
//       },
//       description:
//         "You whisper magical words that antagonize one creature of your choice within range. The target must make a Wisdom saving throw. On a failed save, the target takes 4d4 psychic damage and must immediately use its reaction to make a melee attack against another creature of your choice that you can see. If the target can't make this attack (for example, because there is no one within its reach or because its reaction is unavailable), the target instead has disadvantage on the next attack roll it makes before the start of your next turn. On a successful save, the target takes half as much damage only.",
//       classes: [
//         {
//           name: "Bard",
//           source: "PHB",
//         },
//         {
//           name: "Sorcerer",
//           source: "PHB",
//         },
//         {
//           name: "Warlock",
//           source: "PHB",
//         },
//         {
//           name: "Wizard",
//           source: "PHB",
//         },
//       ],
//     },
//   ],
//   feats: [
//     {
//       name: "Aberrant Dragonmark",
//       source: "ERLW",
//       page: 52,
//       category: null,
//       prerequisite: [
//         {
//           other: "No other dragonmark",
//         },
//       ],
//       ability: [
//         {
//           con: 1,
//         },
//       ],
//       additionalSpells: [
//         {
//           ability: "con",
//           innate: {
//             _: {
//               rest: {
//                 "1": [
//                   {
//                     choose: "level=1|class=Sorcerer",
//                   },
//                 ],
//               },
//             },
//           },
//           known: {
//             _: [
//               {
//                 choose: "level=0|class=Sorcerer",
//               },
//             ],
//           },
//         },
//       ],
//       entries:
//         "You have manifested an aberrant dragonmark. Determine its appearance and the flaw associated with it. You gain the following benefits:\n\n- You learn a cantrip of your choice from the sorcerer spell list. In addition, choose a 1st-level spell from the sorcerer spell list. You learn that spell and can cast it through your mark. Once you cast it, you must finish a short or long rest before you can cast it again through the mark. Constitution is your spellcasting ability for these spells.\n- When you cast the 1st-level spell through your mark, you can expend one of your Hit Dice and roll it. If you roll an even number, you gain a number of temporary hit points equal to the number rolled. If you roll an odd number, one random creature within 30 feet of you (not including you) takes force damage equal to the number rolled. If no other creatures are in range, you take the damage.\n\nYou also develop a random flaw from the Aberrant Dragonmark Flaws table.",
//     },
//   ],
//   classes: [
//     {
//       name: "Artificer",
//       source: "TCE",
//       hitDice: {
//         number: 1,
//         faces: 8,
//       },
//       proficiencies: ["con", "int"],
//       startingProficiencies: {
//         armor: ["light", "medium", "shield"],
//         weapons: [
//           "simple",
//           {
//             proficiency: "firearms",
//             optional: true,
//           },
//         ],
//         tools: [
//           "thieves' tools",
//           "tinker's tools",
//           "one type of artisan's tools of your choice",
//         ],
//         skills: [
//           {
//             choose: {
//               from: [
//                 "arcana",
//                 "history",
//                 "investigation",
//                 "medicine",
//                 "nature",
//                 "perception",
//                 "sleight of hand",
//               ],
//               count: 2,
//             },
//           },
//         ],
//       },
//       multiclassing: {
//         requirements: {
//           int: 13,
//         },
//       },
//       features: [
//         {
//           name: "Magical Tinkering",
//           level: 1,
//           description:
//             "You've learned how to invest a spark of magic into mundane objects. To use this ability, you must have thieves' tools or artisan's tools in hand. You then touch a Tiny nonmagical object as an action and give it one of the following magical properties of your choice...",
//         },
//         {
//           name: "Spellcasting",
//           level: 1,
//           description:
//             "You've studied the workings of magic and how to cast spells, channeling the magic through objects. To observers, you don't appear to be casting spells in a conventional way...",
//         },
//       ],
//       subclasses: [
//         {
//           name: "Alchemist",
//           shortName: "Alchemist",
//           source: "TCE",
//         },
//         {
//           name: "Armorer",
//           shortName: "Armorer",
//           source: "TCE",
//         },
//       ],
//     },
//   ],
// };

// Utility function to format markdown-like text
const formatText = (text: string) => {
  if (!text) return "";

  return text
    .replace(/### (.*)/g, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n\n/g, '</p><p class="mb-2">')
    .replace(/\n/g, "<br/>");
};

// Component for displaying spell components
const SpellComponents = ({ components }: { components: any }) => {
  if (!components) return null;

  const componentsList = [];
  if (components.v) componentsList.push("V");
  if (components.s) componentsList.push("S");
  if (components.m) componentsList.push("M");

  const renderMaterialComponent = (m: any): string => {
    if (typeof m === "string") return m;

    if (typeof m === "object" && m.text) {
      let text = m.text;
      if (m.cost) {
        const gp = m.cost / 100;
        text += ` (${gp} gp)`;
      }
      if (m.consume) {
        text += ", consumed";
      }
      return text;
    }

    return JSON.stringify(m); // fallback for unexpected structures
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {componentsList.map((comp, index) => (
          <Badge key={index} variant="outline" className="text-xs">
            {comp}
          </Badge>
        ))}
      </div>
      {components.m && (
        <span className="text-xs text-muted-foreground">
          ({renderMaterialComponent(components.m)})
        </span>
      )}
    </div>
  );
};

// Component for displaying spell school
const getSchoolName = (school: string) => {
  const schools: Record<string, string> = {
    A: "Abjuration",
    C: "Conjuration",
    D: "Divination",
    E: "Enchantment",
    V: "Evocation",
    I: "Illusion",
    N: "Necromancy",
    T: "Transmutation",
  };
  return schools[school] || school;
};

const StartingProficiencies = ({
  startingProficiencies,
}: {
  startingProficiencies?: any;
}) => {
  const [open, setOpen] = useState(false);
  if (!startingProficiencies) return null;

  // Helper to render array entries, handling strings and objects with 'proficiency' etc
  const renderProficiencyItem = (item: any, index: number) => {
    if (typeof item === "string") return <span key={index}>{item}</span>;
    if (typeof item === "object" && item.proficiency)
      return (
        <span key={index}>
          {item.proficiency} {item.optional ? "(optional)" : ""}
        </span>
      );
    if (typeof item === "object" && item.choose) {
      return (
        <div key={index} className="pl-4">
          Choose {item.choose.count} from: {item.choose.from.join(", ")}
        </div>
      );
    }
    // fallback stringify
    return <span key={index}>{JSON.stringify(item)}</span>;
  };

  return (
    <div>
      {/* Outer toggle button to collapse/expand the whole accordion */}
      <button
        className="mb-2 text-sm font-semibold text-primary underline"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="starting-proficiencies-accordion"
      >
        {open ? "Hide Starting Proficiencies" : "Show Starting Proficiencies"}
      </button>
      {open && (
        <Accordion type="multiple" className="space-y-2 mt-2">
          {Object.entries(startingProficiencies).map(([category, values]) => (
            <AccordionItem key={category} value={category}>
              <AccordionTrigger className="font-semibold text-sm text-primary capitalize">
                {category}
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-1 text-sm text-muted-foreground">
                  {Array.isArray(values) && values.length > 0 ? (
                    values.map((val, idx) => (
                      <div
                        key={idx}
                        className="border border-border rounded px-2 py-1"
                      >
                        {renderProficiencyItem(val, idx)}
                      </div>
                    ))
                  ) : (
                    <div className="italic text-xs">No data</div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};
type SubclassFeature = {
  name: string;
  level: number;
  description: string;
};

type Subclass = {
  name: string;
  shortName?: string;
  source?: string;
  page?: number;
  edition?: string;
  features: SubclassFeature[];
};
export const Subclass = ({ subclasses }: { subclasses: Subclass[] }) => {
  const [openSubclass, setOpenSubclass] = useState<string | null>(null);

  if (!subclasses || subclasses.length === 0) return null;

  const handleToggle = (name: string) => {
    setOpenSubclass((prev) => (prev === name ? null : name));
  };

  return (
    <div className="space-y-2 mt-4">
      <strong className="text-sm">Subclasses:</strong>
      <div className="flex flex-wrap gap-2">
        {subclasses.map((subclass, index) => (
          <Badge
            key={index}
            variant={openSubclass === subclass.name ? "default" : "secondary"}
            className="cursor-pointer text-xs"
            onClick={() => handleToggle(subclass.name)}
          >
            {subclass.name}
          </Badge>
        ))}
      </div>

      {subclasses.map((subclass, index) => {
        if (openSubclass !== subclass.name) return null;

        // Group features by level
        const grouped = subclass.features.reduce(
          (acc: Record<number, SubclassFeature[]>, feature) => {
            if (!acc[feature.level]) acc[feature.level] = [];
            acc[feature.level].push(feature);
            return acc;
          },
          {}
        );

        return (
          <div
            key={`details-${index}`}
            className="mt-4 p-4 border rounded bg-muted/30"
          >
            <div className="mb-2">
              <h4 className="font-semibold text-base">{subclass.name}</h4>
              <p className="text-sm text-muted-foreground">
                {subclass.source && `Source: ${subclass.source}`}{" "}
                {subclass.page && `(pg. ${subclass.page})`}
              </p>
            </div>
            <Accordion type="multiple" className="space-y-2">
              {Object.entries(grouped)
                .sort((a, b) => Number(a[0]) - Number(b[0]))
                .map(([level, feats]) => (
                  <AccordionItem key={level} value={`level-${level}`}>
                    <AccordionTrigger className="text-sm font-medium text-primary">
                      Level {level}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        {feats.map((feat, i) => (
                          <div key={i} className="text-sm">
                            <div className="font-semibold">{feat.name}</div>
                            <div className="text-muted-foreground whitespace-pre-wrap text-xs">
                              {feat.description}
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
            </Accordion>
          </div>
        );
      })}
    </div>
  );
};

// Component for displaying class features table
const ClassTable = ({ classTableGroups }: { classTableGroups: any[] }) => {
  if (!classTableGroups || classTableGroups.length === 0) return null;

  const renderClassTableCell = (cell: any): React.ReactNode => {
    if (cell == null) return "";

    if (typeof cell !== "object") return cell;

    switch (cell.type) {
      case "bonus":
      case "bonusSpeed":
        return `+${cell.value}`;
      case "dice":
        if (Array.isArray(cell.toRoll)) {
          return cell.toRoll
            .map((d: any) => `${d.number}d${d.faces}`)
            .join(" + ");
        }
        return "1d?";
      default:
        return JSON.stringify(cell);
    }
  };

  return (
    <div className="space-y-4">
      {classTableGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="overflow-x-auto">
          <table className="w-full text-xs border-collapse border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border p-1 text-left">Level</th>
                {group.colLabels.map((label: string, index: number) => (
                  <th
                    key={index}
                    className="border border-border p-1 text-center"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {group.rows.map((row: any[], rowIndex: number) => (
                <tr key={rowIndex}>
                  <td className="border border-border p-1 font-medium">
                    {rowIndex + 1}
                  </td>
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="border border-border p-1 text-center"
                    >
                      {renderClassTableCell(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

const ClassFeatures = ({ features }: { features: any[] }) => {
  const [open, setOpen] = useState(false);

  if (!features || features.length === 0) return null;

  // Group features by level
  const grouped = features.reduce((acc: Record<number, any[]>, feature) => {
    if (!acc[feature.level]) acc[feature.level] = [];
    acc[feature.level].push(feature);
    return acc;
  }, {});

  return (
    <div>
      {/* Outer toggle button to collapse/expand the whole accordion */}
      <button
        className="mb-2 text-sm font-semibold text-primary underline"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="class-features-accordion"
      >
        {open ? "Hide Class Features" : "Show Class Features"}
      </button>

      {/* Conditionally render the accordion */}
      {open && (
        <Accordion
          type="multiple"
          id="class-features-accordion"
          className="space-y-2"
        >
          {Object.entries(grouped)
            .sort((a, b) => Number(a[0]) - Number(b[0]))
            .map(([level, featuresAtLevel]) => (
              <AccordionItem value={`level-${level}`} key={level}>
                <AccordionTrigger className="text-primary font-semibold text-sm">
                  Level {level}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {featuresAtLevel.map((feat, index) => (
                      <div
                        key={index}
                        className="border border-border rounded p-3"
                      >
                        <div className="font-medium text-sm">{feat.name}</div>
                        <div className="text-xs text-muted-foreground whitespace-pre-wrap">
                          {feat.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
        </Accordion>
      )}
    </div>
  );
};

// Component for displaying prerequisites
const renderPrerequisite = (prereq: any): string => {
  if (prereq.other) return prereq.other;

  const parts: string[] = [];

  for (const [key, value] of Object.entries(prereq)) {
    switch (key) {
      case "level":
        if (typeof value === "number") {
          parts.push(`Level ${value}`);
        } else if (
          typeof value === "object" &&
          value !== null &&
          "level" in value &&
          typeof (value as any).level === "number"
        ) {
          const className =
            typeof (value as any).class === "object" &&
            (value as any).class?.name
              ? (value as any).class.name
              : "";
          parts.push(`Level ${(value as any).level} ${className}`.trim());
        }
        break;

      case "ability":
        if (Array.isArray(value)) {
          value.forEach((abilityObj) => {
            for (const [stat, score] of Object.entries(abilityObj)) {
              parts.push(`${stat.toUpperCase()} ${score}`);
            }
          });
        }
        break;

      case "background":
        if (Array.isArray(value)) {
          const names = value.map((b) => b.displayEntry ?? b.name).join(", ");
          parts.push(`Background: ${names}`);
        }
        break;

      case "campaign":
        if (Array.isArray(value)) {
          parts.push(`Campaign: ${value.join(", ")}`);
        }
        break;

      case "feat":
        if (Array.isArray(value)) {
          parts.push(`Feat: ${value.join(", ")}`);
        }
        break;

      case "proficiency":
        if (Array.isArray(value)) {
          value.forEach((prof) => {
            for (const [type, detail] of Object.entries(prof)) {
              parts.push(`Proficiency: ${detail} ${type}`);
            }
          });
        }
        break;

      case "feature":
        if (Array.isArray(value)) {
          parts.push(`Feature: ${value.join(", ")}`);
        }
        break;

      default:
        parts.push(`${key.toUpperCase()}: ${JSON.stringify(value)}`);
        break;
    }
  }

  return parts.join(", ");
};

const Prerequisites = ({ prerequisites }: { prerequisites: any[] }) => {
  if (!prerequisites || prerequisites.length === 0) return null;

  return (
    <div>
      <strong className="text-sm">Prerequisites:</strong>
      <div className="text-sm text-muted-foreground mt-1">
        {prerequisites.map((p) => renderPrerequisite(p)).join(" or ")}
      </div>
    </div>
  );
};

const AbilityBonuses = ({ bonuses }: { bonuses: any[] }) => {
  if (!bonuses || bonuses.length === 0) return null;

  const renderBonus = (bonus: any, index: number) => {
    // If it’s a flat ability bonus like { con: 1 }
    if (typeof bonus === "object" && !Array.isArray(bonus)) {
      // Check for choose block
      if ("choose" in bonus) {
        const choose = bonus.choose;
        const from = (choose.from || [])
          .map((a: string) => a.toUpperCase())
          .join(", ");
        const count = choose.count || choose.amount;

        return (
          <Badge key={index} variant="outline" className="text-xs">
            {count ? `Choose ${count} from ${from}` : `Choose from ${from}`}
          </Badge>
        );
      }

      // Otherwise, display flat ability bonuses
      return Object.entries(bonus)
        .filter(([ability]) => ability !== "hidden" && ability !== "max")
        .map(([ability, value], i) => (
          <Badge key={`${index}-${i}`} variant="secondary" className="text-xs">
            {ability.toUpperCase()} +{(value as string | number) ?? ""}
          </Badge>
        ));
    }

    return null;
  };

  return <div className="flex flex-wrap gap-1">{bonuses.map(renderBonus)}</div>;
};

// Component for displaying skill proficiencies
const SkillProficiencies = ({ skills }: { skills: any[] }) => {
  if (!skills || skills.length === 0) return null;

  const allSkills = skills.reduce((acc, skillObj) => {
    Object.keys(skillObj).forEach((skill) => {
      if (skillObj[skill] === true) {
        acc.push(skill);
      }
    });
    return acc;
  }, []);

  return (
    <div className="flex flex-wrap gap-1">
      {allSkills.map((skill: string, index: number) => (
        <Badge key={index} variant="outline" className="text-xs capitalize">
          {skill}
        </Badge>
      ))}
    </div>
  );
};

// Component for displaying equipment
const Equipment = ({ equipment }: { equipment: any[] }) => {
  if (!equipment || equipment.length === 0) return null;

  const renderEquipmentItem = (item: any, index: number): React.ReactNode => {
    if (typeof item === "string") {
      return (
        <span key={index} className="text-sm">
          {item}
        </span>
      );
    }

    if (item.item) {
      return (
        <span key={index} className="text-sm">
          {item.displayName || item.item}
          {item.quantity && ` (${item.quantity})`}
        </span>
      );
    }

    if (item.special) {
      return (
        <span key={index} className="text-sm">
          {item.special}
          {item.quantity && ` (${item.quantity})`}
        </span>
      );
    }

    if (item.containsValue) {
      return (
        <span key={index} className="text-sm">
          Pouch ({item.containsValue / 100} gp)
        </span>
      );
    }

    return null;
  };

  return (
    <div className="space-y-2">
      {equipment.map((equipGroup, groupIndex) => (
        <div key={groupIndex}>
          {equipGroup._ && (
            <div className="flex flex-wrap gap-2">
              {equipGroup._.map((item: any, index: number) =>
                renderEquipmentItem(item, index)
              )}
            </div>
          )}
          {(equipGroup.a || equipGroup.b) && (
            <div className="text-sm text-muted-foreground">
              Choose:{" "}
              {equipGroup.a &&
                `A) ${equipGroup.a
                  .map((item: any) => item.displayName || item.item)
                  .join(", ")}`}
              {equipGroup.a && equipGroup.b && " or "}
              {equipGroup.b &&
                `B) ${equipGroup.b
                  .map((item: any) => item.displayName || item.special)
                  .join(", ")}`}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Individual item card component
const ItemCard = ({ item, type }: { item: any; type: string }) => {
  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{item.name}</CardTitle>
            <CardDescription>
              {item.source} • Page {item.page}
              {item.srd && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  SRD
                </Badge>
              )}
              {item.basicRules && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  Basic Rules
                </Badge>
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Spell-specific information */}
        {type === "spells" && (
          <>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Level:</strong>{" "}
                {item.level === 0
                  ? "Cantrip"
                  : `${item.level}${
                      ["st", "nd", "rd"][item.level - 1] || "th"
                    } level`}
              </div>
              <div>
                <strong>School:</strong> {getSchoolName(item.school)}
              </div>
              <div>
                <strong>Casting Time:</strong> {item.time?.[0]?.number}{" "}
                {item.time?.[0]?.unit}
              </div>
              <div>
                <strong>Range:</strong>{" "}
                {item.range?.type === "point"
                  ? `${item.range.distance?.amount} ${item.range.distance?.type}`
                  : item.range?.type || "Self"}
              </div>
              <div>
                <strong>Duration:</strong>{" "}
                {item.duration?.[0]?.type || "Instantaneous"}
              </div>
              <div>
                <strong>Ritual:</strong> {item.ritual ? "Yes" : "No"}
              </div>
            </div>

            {item.components && (
              <div>
                <strong className="text-sm">Components:</strong>
                <div className="mt-1">
                  <SpellComponents components={item.components} />
                </div>
              </div>
            )}

            {item.classes && item.classes.length > 0 && (
              <div>
                <strong className="text-sm">Classes:</strong>
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.classes.map((cls: any, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {cls.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Feat-specific information */}
        {type === "feats" && (
          <>
            {item.prerequisite && (
              <Prerequisites prerequisites={item.prerequisite} />
            )}

            {item.ability && item.ability.length > 0 && (
              <div>
                <strong className="text-sm">Ability Score Increase:</strong>
                <div className="mt-1">
                  <AbilityBonuses bonuses={item.ability} />
                </div>
              </div>
            )}

            {item.category && (
              <div>
                <Badge variant="default" className="text-xs">
                  {item.category}
                </Badge>
              </div>
            )}
          </>
        )}

        {/* Class-specific information */}
        {type === "classes" && (
          <>
            {item.hitDice && (
              <div>
                <strong className="text-sm">Hit Die:</strong> d
                {item.hitDice.faces}
              </div>
            )}

            {item.proficiencies && item.proficiencies.length > 0 && (
              <div>
                <strong className="text-sm">Saving Throws:</strong>
                <div className="flex gap-1 mt-1">
                  {item.proficiencies.map((prof: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {prof.toUpperCase()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {item.startingProficiencies && (
              <StartingProficiencies
                startingProficiencies={item.startingProficiencies}
              />
            )}

            {item.multiclassing?.requirements && (
              <div>
                <strong className="text-sm">Multiclassing Requirement:</strong>
                <div className="text-sm text-muted-foreground">
                  {Object.entries(item.multiclassing.requirements)
                    .map(
                      ([ability, score]) => `${ability.toUpperCase()} ${score}`
                    )
                    .join(", ")}
                </div>
              </div>
            )}

            <Subclass subclasses={item.subclasses} />

            {item.classTableGroups && (
              <div>
                <strong className="text-sm">Class Table:</strong>
                <div className="mt-2">
                  <ClassTable classTableGroups={item.classTableGroups} />
                </div>
              </div>
            )}

            {item.features && item.features.length > 0 && (
              <div className="mt-4">
                <strong className="text-sm">Class Features:</strong>
                <ClassFeatures features={item.features} />
              </div>
            )}
          </>
        )}

        {/* Race-specific information */}
        {type === "races" && (
          <>
            {item.size && (
              <div>
                <strong className="text-sm">Size:</strong>{" "}
                {item.size.join(", ")}
              </div>
            )}

            {item.speed && (
              <div>
                <strong className="text-sm">Speed:</strong>
                <div className="flex gap-2 mt-1">
                  {Object.entries(item.speed).map(
                    ([type, speed]: [string, any]) => (
                      <Badge key={type} variant="outline" className="text-xs">
                        {type}: {speed}ft
                      </Badge>
                    )
                  )}
                </div>
              </div>
            )}

            {item.abilityBonuses && item.abilityBonuses.length > 0 && (
              <div>
                <strong className="text-sm">Ability Score Increases:</strong>
                <div className="mt-1">
                  <AbilityBonuses bonuses={item.abilityBonuses} />
                </div>
              </div>
            )}

            {item.age && Object.keys(item.age).length > 0 && (
              <div>
                <strong className="text-sm">Age:</strong>
                <div className="text-sm text-muted-foreground">
                  Mature: {item.age.mature} • Max: {item.age.max}
                </div>
              </div>
            )}
          </>
        )}

        {/* Background-specific information */}
        {type === "backgrounds" && (
          <>
            {item.skillProficiencies && item.skillProficiencies.length > 0 && (
              <div>
                <strong className="text-sm">Skill Proficiencies:</strong>
                <div className="mt-1">
                  <SkillProficiencies skills={item.skillProficiencies} />
                </div>
              </div>
            )}

            {item.languageProficiencies &&
              item.languageProficiencies.length > 0 && (
                <div>
                  <strong className="text-sm">Languages:</strong>
                  <div className="text-sm text-muted-foreground">
                    {item.languageProficiencies
                      .map((lang: any, index: number) => {
                        if (lang.anyStandard)
                          return `${lang.anyStandard} of your choice`;
                        return Object.keys(lang)
                          .filter((key) => lang[key] === true)
                          .join(", ");
                      })
                      .join(", ")}
                  </div>
                </div>
              )}

            {item.startingEquipment && item.startingEquipment.length > 0 && (
              <div>
                <strong className="text-sm">Starting Equipment:</strong>
                <div className="mt-1">
                  <Equipment equipment={item.startingEquipment} />
                </div>
              </div>
            )}

            {item.feature && (
              <div>
                <Badge variant="default" className="text-xs">
                  Feature: {item.feature}
                </Badge>
              </div>
            )}
          </>
        )}

        {/* Trait tags */}
        {item.traitTags && item.traitTags.length > 0 && (
          <div>
            <strong className="text-sm">Traits:</strong>
            <div className="flex flex-wrap gap-1 mt-1">
              {item.traitTags.map((tag: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {item.entries && (
          <div>
            <Separator className="my-3" />
            <div
              className="text-sm prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html: `<p class="mb-2">${formatText(item.entries)}</p>`,
              }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Main browser component
const DNDBrowser = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSource, setSelectedSource] = useState("all");
  const [activeTab, setActiveTab] = useState("backgrounds");

  // Get available sources
  const sources = useMemo(() => {
    const allSources = new Set(["all"]);
    Object.values(mockData)
      .flat()
      .forEach((item: any) => {
        if (item.source) allSources.add(item.source);
      });
    return Array.from(allSources);
  }, []);

  // Filter items based on search and source
  const filteredItems = useMemo(() => {
    const items = mockData[activeTab as keyof typeof mockData] || [];

    return items.filter((item: any) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.entries &&
          item.entries.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesSource =
        selectedSource === "all" || item.source === selectedSource;

      return matchesSearch && matchesSource;
    });
  }, [searchTerm, selectedSource, activeTab]);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">D&D 5e Browser</h1>
        <p className="text-muted-foreground">
          Browse races, backgrounds, and more from your D&D collection
        </p>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            {sources.map((source) => (
              <option key={source} value={source}>
                {source === "all" ? "All Sources" : source}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="backgrounds" className="flex items-center gap-2">
            <Scroll className="h-4 w-4" />
            Backgrounds ({mockData.backgrounds.length})
          </TabsTrigger>
          <TabsTrigger value="races" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Races ({mockData.races.length})
          </TabsTrigger>
          <TabsTrigger value="spells" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Spells ({mockData.spells.length})
          </TabsTrigger>
          <TabsTrigger value="feats" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Feats ({mockData.feats.length})
          </TabsTrigger>
          <TabsTrigger value="classes" className="flex items-center gap-2">
            <Sword className="h-4 w-4" />
            Classes ({mockData.classes.length})
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredItems.length} results
            </p>
          </div>

          <ScrollArea className="h-[800px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 pr-4">
              {filteredItems.map((item: any, index: number) => (
                <ItemCard
                  key={`${item.name}-${index}`}
                  item={item}
                  type={activeTab}
                />
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No items found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or filters
                </p>
              </div>
            )}
          </ScrollArea>
        </div>
      </Tabs>
    </div>
  );
};

export default DNDBrowser;
