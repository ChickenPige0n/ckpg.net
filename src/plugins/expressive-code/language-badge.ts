/**
 * Based on the discussion at https://github.com/expressive-code/expressive-code/issues/153#issuecomment-2282218684
 */
import { definePlugin, type ExpressiveCodePlugin } from "@expressive-code/core";

export function pluginLanguageBadge(): ExpressiveCodePlugin {
	return definePlugin({
		name: "Language Badge",
		baseStyles: () => `
      [data-language]::before {
        position: absolute;
        z-index: 2;
        right: 0.6rem;
        top: 0.55rem;
        padding: 0.1rem 0.45rem;
        content: attr(data-language);
        font-family: "JetBrains Mono Variable", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        font-size: 0.68rem;
        font-weight: 500;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.55);
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 0;
        pointer-events: none;
        transition: opacity 0.2s;
        opacity: 0;
      }
      .frame:not(.has-title):not(.is-terminal) {
        @media (hover: none) {
          & [data-language]::before {
            opacity: 1;
            margin-right: 3rem;
          }
          & [data-language]:active::before {
            opacity: 0;
          }
        }
        @media (hover: hover) {
          & [data-language]::before {
            opacity: 1;
          }
          &:hover [data-language]::before {
            opacity: 0;
          }
        }
      }
    `,
	});
}
