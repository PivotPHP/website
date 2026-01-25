#!/usr/bin/env bash
set -euo pipefail

MODE=""
VERSION=""
STATUS=""
CANONICAL=false
VERSIONS_FILE="_data/versions.yml"
RELEASE_DATE=""
SUPPORT_UNTIL=""
EOL_DATE=""
DOCS_PATH=""
LABEL=""
BADGE_TEXT=""
BADGE_COLOR=""
BANNER_TYPE=""
SHOW_UPGRADE=""
UPGRADE_MESSAGE=""
DRY_RUN=false

print_help() {
  cat <<'EOF'
Usage:
  promote-version.sh --add <version> --status <status> [options]
  promote-version.sh --promote <version> --status <status> [options]
  promote-version.sh --set-canonical <version>
  promote-version.sh --check-consistency

Options:
  --versions-file <path>      Path to versions.yml (default: _data/versions.yml)
  --release-date YYYY-MM-DD   Release date
  --support-until YYYY-MM-DD  Support until date
  --eol-date YYYY-MM-DD       End-of-life date
  --docs-path <path>          Docs path (default: /docs/<version>/)
  --label <text>              Label text
  --badge-text <text>         Badge text
  --badge-color <text>        Badge color
  --banner-type <type>        eol|maintenance|stable-outdated|beta|none
  --show-upgrade-banner true|false
  --upgrade-banner-message <text>
  --canonical                 Mark version as canonical (clears others)
  --dry-run                   Validate and print summary without writing
  -h, --help                  Show this help
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --add) MODE="add"; VERSION="$2"; shift 2;;
    --promote) MODE="promote"; VERSION="$2"; shift 2;;
    --set-canonical) MODE="set-canonical"; VERSION="$2"; shift 2;;
    --check-consistency) MODE="check"; shift;;
    --status) STATUS="$2"; shift 2;;
    --versions-file) VERSIONS_FILE="$2"; shift 2;;
    --release-date) RELEASE_DATE="$2"; shift 2;;
    --support-until) SUPPORT_UNTIL="$2"; shift 2;;
    --eol-date) EOL_DATE="$2"; shift 2;;
    --docs-path) DOCS_PATH="$2"; shift 2;;
    --label) LABEL="$2"; shift 2;;
    --badge-text) BADGE_TEXT="$2"; shift 2;;
    --badge-color) BADGE_COLOR="$2"; shift 2;;
    --banner-type) BANNER_TYPE="$2"; shift 2;;
    --show-upgrade-banner) SHOW_UPGRADE="$2"; shift 2;;
    --upgrade-banner-message) UPGRADE_MESSAGE="$2"; shift 2;;
    --canonical) CANONICAL=true; shift;;
    --dry-run) DRY_RUN=true; shift;;
    -h|--help) print_help; exit 0;;
    *) echo "Unknown option: $1" >&2; exit 1;;
  esac
done

if [[ -z "$MODE" ]]; then
  echo "No action provided. Use --add, --promote, --set-canonical or --check-consistency." >&2
  exit 1
fi

ruby <<'RUBY'
require 'yaml'
require 'date'
require 'json'

mode = ENV.fetch('MODE')
version = ENV['VERSION']
status = ENV['STATUS']
canonical = ENV['CANONICAL'] == 'true'
versions_file = ENV['VERSIONS_FILE']
release_date = ENV['RELEASE_DATE']
support_until = ENV['SUPPORT_UNTIL']
eol_date = ENV['EOL_DATE']
docs_path = ENV['DOCS_PATH']
label = ENV['LABEL']
badge_text = ENV['BADGE_TEXT']
badge_color = ENV['BADGE_COLOR']
banner_type = ENV['BANNER_TYPE']
show_upgrade = ENV['SHOW_UPGRADE']
upgrade_message = ENV['UPGRADE_MESSAGE']
dry_run = ENV['DRY_RUN'] == 'true'

allowed_status = %w[eol maintenance stable stable-outdated beta current]
allowed_banner = %w[eol maintenance stable-outdated beta none]
banner_from_status = {
  'eol' => 'eol',
  'maintenance' => 'maintenance',
  'stable' => 'none',
  'stable-outdated' => 'stable-outdated',
  'beta' => 'beta',
  'current' => 'none'
}
badge_defaults = {
  'eol' => 'red',
  'maintenance' => 'yellow',
  'stable' => 'green',
  'stable-outdated' => 'orange',
  'beta' => 'blue',
  'current' => 'blue'
}

unless File.exist?(versions_file)
  abort "versions file not found: #{versions_file}"
end

data = YAML.load_file(versions_file) || {}
data['versions'] ||= []

versions = data['versions']

validate_date = lambda do |val, field|
  return if val.nil? || val.strip.empty?
  begin
    Date.strptime(val, '%Y-%m-%d')
  rescue ArgumentError
    abort "Invalid #{field} date format (expected YYYY-MM-DD): #{val}"
  end
end

case mode
when 'add'
  abort 'Version is required for --add' if version.nil? || version.empty?
  abort 'Status is required for --add' if status.nil? || status.empty?
  abort "Invalid status: #{status}" unless allowed_status.include?(status)
  validate_date.call(release_date, 'release')
  validate_date.call(support_until, 'support_until')
  validate_date.call(eol_date, 'eol')
  existing = versions.find { |v| v['number'] == version }
  abort "Version #{version} already exists" if existing

  entry = {
    'number' => version,
    'status' => status,
    'is_canonical' => canonical,
    'banner_type' => banner_type && !banner_type.empty? ? banner_type : banner_from_status[status],
    'label' => label && !label.empty? ? label : status.capitalize,
    'badge_color' => badge_color && !badge_color.empty? ? badge_color : badge_defaults[status],
    'badge_text' => badge_text && !badge_text.empty? ? badge_text : status.capitalize,
    'docs_path' => docs_path && !docs_path.empty? ? docs_path : "/pt/docs/v#{version.split('.').first}/",
    'release_date' => release_date,
    'support_until' => support_until,
    'eol_date' => eol_date,
    'show_upgrade_banner' => show_upgrade.empty? ? false : show_upgrade == 'true',
    'upgrade_banner_message' => upgrade_message
  }.delete_if { |_k, v| v.nil? || v == '' }

  versions << entry
when 'promote'
  abort 'Version is required for --promote' if version.nil? || version.empty?
  abort 'Status is required for --promote' if status.nil? || status.empty?
  abort "Invalid status: #{status}" unless allowed_status.include?(status)
  validate_date.call(release_date, 'release')
  validate_date.call(support_until, 'support_until')
  validate_date.call(eol_date, 'eol')
  entry = versions.find { |v| v['number'] == version }
  abort "Version #{version} not found" unless entry
  entry['status'] = status
  entry['banner_type'] = banner_type && !banner_type.empty? ? banner_type : banner_from_status[status]
  entry['label'] = label unless label.nil? || label.empty?
  entry['badge_color'] = badge_color unless badge_color.nil? || badge_color.empty?
  entry['badge_text'] = badge_text unless badge_text.nil? || badge_text.empty?
  entry['docs_path'] = docs_path unless docs_path.nil? || docs_path.empty?
  entry['release_date'] = release_date unless release_date.nil? || release_date.empty?
  entry['support_until'] = support_until unless support_until.nil? || support_until.empty?
  entry['eol_date'] = eol_date unless eol_date.nil? || eol_date.empty?
  unless show_upgrade.nil? || show_upgrade.empty?
    entry['show_upgrade_banner'] = show_upgrade == 'true'
  end
  entry['upgrade_banner_message'] = upgrade_message unless upgrade_message.nil? || upgrade_message.empty?
  entry['is_canonical'] = canonical
when 'set-canonical'
  abort 'Version is required for --set-canonical' if version.nil? || version.empty?
  entry = versions.find { |v| v['number'] == version }
  abort "Version #{version} not found" unless entry
  versions.each { |v| v['is_canonical'] = false }
  entry['is_canonical'] = true
when 'check'
  # handled later
else
  abort "Unknown mode: #{mode}"
end

# Canonical consistency
if canonical || mode == 'set-canonical'
  versions.each { |v| v['is_canonical'] = false }
  target = versions.find { |v| v['number'] == version }
  abort "Version #{version} not found for canonical" if target.nil?
  target['is_canonical'] = true
end

if mode == 'check'
  canonical_count = versions.count { |v| v['is_canonical'] }
  abort 'Consistency check failed: exactly one canonical version required' unless canonical_count == 1
  puts 'Consistency check passed'
  exit 0
end

canonical_count = versions.count { |v| v['is_canonical'] }
abort "Invalid canonical count: #{canonical_count}. Exactly one canonical required." unless canonical_count == 1

if dry_run
  puts "DRY-RUN: changes prepared, no file written"
  puts YAML.dump(data)
  exit 0
end

File.write(versions_file, YAML.dump(data))
puts "Updated #{versions_file} with mode=#{mode} version=#{version}"
RUBY
RUBY