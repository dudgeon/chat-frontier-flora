# Cursor Recovery Log - June 8, 2025

## Summary
A simple task to update test selectors (`input[name]` → `[data-testid]`) spiraled into hours of wasted time due to Cursor losing context and making careless changes.

## Timeline
- **Task**: Update production test selectors to use data-testid attributes
- **Expected time**: 15-30 minutes
- **Actual time**: 2+ hours
- **Cost**: Significant API credits wasted

## What Went Wrong
1. **Lost Context**: Cursor created a PR without verifying the app worked locally
2. **Dependency Issues**: Mime module error crashed the dev server
3. **Wrong Test Target**: Tests were running against production instead of localhost
4. **Circular Failures**: Instead of fixing root issues, Cursor kept making more changes

## What Was Actually Needed
Just 4 simple changes:
1. Add `testID` prop support to Checkbox component
2. Add `data-testid` attributes to form fields
3. Update test selectors from `input[name="..."]` to `[data-testid="..."]`
4. Test locally before creating PR

## Recovery Steps Taken
1. Stashed all uncommitted changes
2. Switched back to main branch
3. Clean reinstalled dependencies
4. Started dev server successfully
5. Applied minimal changes on feature branch
6. Verified changes work locally

## Lessons Learned
1. **Always test locally first** before creating PRs
2. **Make minimal changes** - don't touch unrelated files
3. **Verify each step** before proceeding to the next
4. **Stop and reassess** when things spiral

## Recommendations for Sonnet
When switching back to Sonnet, provide this context:
- Current branch: `fix/production-test-selectors`
- Changes made: Added testID attributes to form components
- Status: Changes work locally, ready to merge
- Known issue: Auth redirect after signup doesn't work (pre-existing)

## Cost Reduction Tips
1. Use Sonnet for routine tasks (it's more efficient)
2. Only use Opus for complex architectural decisions
3. Set clear boundaries: "Only modify these specific files"
4. Demand verification at each step: "Show me the test passed"
5. Stop immediately if the AI starts making unrelated changes
