#!/usr/bin/env bash
# Labels and rulesets for the agent workflows. Idempotent; run as a repo admin.
#   scripts/agent-setup.sh hsimah-services/listory
set -euo pipefail

repo="${1:?usage: agent-setup.sh <owner/repo>}"

label() {
  gh label create "$1" -R "$repo" --color "$2" --description "$3" --force
}

label agent:ready       0e8a16 "Owner-approved for Haiku to implement"
label agent:changes     fbca04 "Reviewer requested changes; Haiku fixes"
label agent:human       1d76db "Reviewer satisfied; owner reviews and merges"
label agent:needs-human d93f0b "Agent gave up or hit the round limit"
label agent:triage      c5def5 "Filed by an agent; owner reviews before agent:ready"

# Repository admin (role 5) is the only bypass, so only the owner can move
# the default branch or any tag. Agents can push branches and open PRs only.
admin='[{"actor_id":5,"actor_type":"RepositoryRole","bypass_mode":"always"}]'

ruleset() {
  local name="$1" target="$2" include="$3" rules="$4" body id
  body=$(jq -n --arg name "$name" --arg target "$target" \
    --argjson include "$include" --argjson rules "$rules" --argjson bypass "$admin" \
    '{name: $name, target: $target, enforcement: "active",
      conditions: {ref_name: {include: $include, exclude: []}},
      rules: $rules, bypass_actors: $bypass}')
  id=$(gh api "repos/$repo/rulesets" --jq ".[] | select(.name == \"$name\") | .id")
  if [[ -n "$id" ]]; then
    gh api -X PUT "repos/$repo/rulesets/$id" --input - <<<"$body" >/dev/null
  else
    gh api -X POST "repos/$repo/rulesets" --input - <<<"$body" >/dev/null
  fi
  echo "ruleset $name: ok"
}

ruleset agent-default-branch branch '["~DEFAULT_BRANCH"]' \
  '[{"type":"update"},{"type":"deletion"},{"type":"non_fast_forward"}]'
ruleset agent-tags tag '["~ALL"]' \
  '[{"type":"creation"},{"type":"update"},{"type":"deletion"}]'

gh secret list -R "$repo" | grep -q '^CLAUDE_CODE_OAUTH_TOKEN' \
  || echo "missing secret: gh secret set CLAUDE_CODE_OAUTH_TOKEN -R $repo"
