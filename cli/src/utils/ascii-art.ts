import chalk from "chalk";

/**
 * CloakScan ASCII Art Logo
 * CLOAK SCAN - CLI text in ASCII block letters
 */
export const CLOAKSCAN_LOGO = `
  ____ _   _   _    ____  ____    ____   ____    _    _   _            ____ _     ___ 
 / ___| | | | / \\  |  _ \\|  _ \\  / ___| / ___|  / \\  | \\ | |          / ___| |   |_ _|
| |  _| | | |/ _ \\ | |_) | | | | \\___ \\| |     / _ \\ |  \\| |  _____  | |   | |    | | 
| |_| | |_| / ___ \\|  _ <| |_| |  ___) | |___ / ___ \\| |\\  | |_____| | |___| |___ | | 
 \\____|\\___/_/   \\_\\_| \\_\\____/  |____/ \\____/_/   \\_\\_| \\_|          \\____|_____|___|
`;

/**
 * CloakScan Shield ASCII Art (Alternative)
 */
export const CLOAKSCAN_SHIELD = `🛡️  CLOAK SCAN - CLI
   Privacy-First Security`;

/**
 * Display CloakScan logo with optional tagline
 */
export function displayLogo(tagline?: string): void {
  console.log(chalk.cyan(CLOAKSCAN_LOGO));
  if (tagline) {
    console.log(chalk.gray(`  ${tagline}\n`));
  }
}

/**
 * Display CloakScan shield banner
 */
export function displayShield(): void {
  console.log(chalk.cyan.bold(CLOAKSCAN_SHIELD));
}

/**
 * Display compact version badge
 */
export function displayVersionBadge(version: string): void {
  console.log(
    chalk.cyan(`
  ╭────────────────────────────────╮
  │  CloakScan v${version.padEnd(20)} │
  ╰────────────────────────────────╯
`)
  );
}

/**
 * Display welcome banner for first-time users
 */
export function displayWelcomeBanner(): void {
  console.log(
    chalk.cyan.bold(`
╔════════════════════════════════════════════════════════════════════════════════════════╗
║                                                                                        ║
║   ██████╗██╗      ██████╗  █████╗ ██╗  ██╗     ███████╗ ██████╗ █████╗ ███╗   ██╗   ║
║  ██╔════╝██║     ██╔═══██╗██╔══██╗██║ ██╔╝     ██╔════╝██╔════╝██╔══██╗████╗  ██║   ║
║  ██║     ██║     ██║   ██║███████║█████╔╝       ███████╗██║     ███████║██╔██╗ ██║   ║
║  ██║     ██║     ██║   ██║██╔══██║██╔═██╗       ╚════██║██║     ██╔══██║██║╚██╗██║   ║
║  ╚██████╗███████╗╚██████╔╝██║  ██║██║  ██╗      ███████║╚██████╗██║  ██║██║ ╚████║   ║
║   ╚═════╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝     ╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═══╝   ║
║                                                                                        ║
║               Privacy-First AI Code Review & Security                                 ║
║                                                                                        ║
╚════════════════════════════════════════════════════════════════════════════════════════╝
`)
  );
  console.log(chalk.gray("           🛡️  Comprehensive Security Scanning\n"));
  console.log(
    chalk.gray("           🤖  AI-Enhanced Code Review (Optional)\n")
  );
  console.log(chalk.gray("           🔒  Your Code Stays Local & Private\n"));
}

/**
 * Display simple banner for commands
 */
export function displaySimpleBanner(command: string): void {
  const banners = {
    init: "🚀 Initializing CloakScan",
    run: "🔍 CloakScan Code Review",
    security: "🛡️  CloakScan Security Scan",
    status: "📊 CloakScan Status",
    config: "⚙️  Configure CloakScan",
    reset: "🔄 Reset CloakScan",
    test: "🧪 CloakScan Test Analysis",
    perf: "⚡ CloakScan Performance Test",
    mutation: "🧬 CloakScan Mutation Test",
    rules: "📋 CloakScan Custom Rules",
    sbom: "📦 CloakScan SBOM Generator",
  };

  const banner =
    banners[command as keyof typeof banners] || `CloakScan - ${command}`;
  console.log(chalk.cyan.bold(`\n${banner}\n`));
}
