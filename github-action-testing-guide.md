# Testing Guide: Auto-publish GitHub Action Fix

## Quick Testing Options

### 1. **Manual Trigger Test (Recommended)**

The workflow includes `workflow_dispatch` which allows manual testing:

1. **Go to GitHub Actions tab** in your repository
2. **Click on "Auto-publish scheduled blog posts"** workflow
3. **Click "Run workflow"** button (top right)
4. **Click the green "Run workflow"** button in the dropdown
5. **Monitor the execution** in real-time

**Expected Results:**
- ✅ No syntax errors (unlike before)
- ✅ Should publish the 4 draft posts dated 2025-06-10 through 2025-06-13
- ✅ Detailed logs showing each file processed
- ✅ Summary report in the workflow output

### 2. **Local Script Testing**

Test the core logic locally before running in GitHub:

```bash
# Navigate to your repo directory
cd /path/to/your/repo

# Create a test script
cat > test-publish-logic.sh << 'EOF'
#!/bin/bash
set -e

CURRENT_DATE=$(date -u +%Y-%m-%d)
CHANGES_COUNT=0
PUBLISHED_POSTS=()

echo "🗓️  Current date: $CURRENT_DATE"
echo "🔍 Scanning for draft posts..."

validate_date() {
    local date="$1"
    if [[ $date =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
        return 0
    else
        return 1
    fi
}

while IFS= read -r file; do
    echo "📄 Checking file: $file"
    
    if grep -q "^draft: true" "$file"; then
        echo "📋 Found draft post: $file"
        
        if POST_DATE=$(grep "^date: " "$file" | sed 's/date: //' | tr -d ' ' | head -1); then
            if [[ -n "$POST_DATE" ]]; then
                echo "📅 Post date: $POST_DATE"
                
                if validate_date "$POST_DATE"; then
                    if [[ "$POST_DATE" <= "$CURRENT_DATE" ]]; then
                        echo "🚀 WOULD PUBLISH: $file (scheduled: $POST_DATE)"
                        ((CHANGES_COUNT++))
                        PUBLISHED_POSTS+=("$file")
                    else
                        echo "⏳ Would skip: $file (scheduled for $POST_DATE)"
                    fi
                else
                    echo "❌ Invalid date format: $POST_DATE"
                fi
            fi
        fi
    else
        echo "ℹ️  Not a draft: $file"
    fi
done < <(find main-docs/blog -name "index.md" -type f)

echo ""
echo "📊 TEST RESULTS"
echo "==============="
echo "✅ Posts that would be published: $CHANGES_COUNT"
echo ""
for post in "${PUBLISHED_POSTS[@]}"; do
    echo "- $post"
done
EOF

# Make executable and run
chmod +x test-publish-logic.sh
./test-publish-logic.sh
```

### 3. **Dry Run Test**

Create a modified version that doesn't actually change files:

```bash
# Test what the workflow will do without making changes
grep -r "draft: true" main-docs/blog/*/index.md | while read -r line; do
    file=$(echo "$line" | cut -d: -f1)
    echo "Found draft: $file"
    
    # Extract date
    date=$(grep "^date: " "$file" | sed 's/date: //' | tr -d ' ')
    echo "  Date: $date"
    
    # Check if it would be published
    if [[ "$date" <= "$(date -u +%Y-%m-%d)" ]]; then
        echo "  ✅ WOULD PUBLISH"
    else
        echo "  ⏳ Would skip (future date)"
    fi
    echo ""
done
```

## Step-by-Step Testing Process

### Phase 1: Pre-test Verification
```bash
# 1. Check current draft posts
echo "Current draft posts:"
find main-docs/blog -name "index.md" -exec grep -l "^draft: true" {} \;

# 2. Check their dates
for file in $(find main-docs/blog -name "index.md" -exec grep -l "^draft: true" {} \;); do
    echo "File: $file"
    echo "  Date: $(grep "^date: " "$file" | sed 's/date: //')"
done
```

### Phase 2: Manual Trigger Test
1. **Commit the workflow changes** (already done)
2. **Push to GitHub** if not already pushed
3. **Go to Actions tab** → "Auto-publish scheduled blog posts"
4. **Click "Run workflow"** → "Run workflow" 
5. **Watch the execution logs**

### Phase 3: Verify Results
After running the workflow:

```bash
# Check if draft posts were actually published
echo "Remaining draft posts:"
find main-docs/blog -name "index.md" -exec grep -l "^draft: true" {} \;

# Check recent commits
git log --oneline -5

# Check which files were modified
git show --name-only HEAD
```

## Expected Test Results

### What Should Happen:
Given today is **2025-06-17** and you have these draft posts:
- `2025-06-10-ag-ui-protocol-series-part-2` (should publish)
- `2025-06-11-interrupt-conference-enterprise-insights-series-part-3` (should publish) 
- `2025-06-12-specialized-ai-applications-series-part-4` (should publish)
- `2025-06-13-ai-ecosystem-2025-complete-landscape-series-part-5` (should publish)

### Expected Workflow Output:
```
🗓️  Current date: 2025-06-17
🔍 Scanning for draft posts to publish...
📄 Checking file: main-docs/blog/2025-06-10-ag-ui-protocol-series-part-2/index.md
📋 Found draft post: main-docs/blog/2025-06-10-ag-ui-protocol-series-part-2/index.md
📅 Post date: 2025-06-11
🚀 Publishing post: main-docs/blog/2025-06-10-ag-ui-protocol-series-part-2/index.md (scheduled: 2025-06-11)
✅ Successfully published: main-docs/blog/2025-06-10-ag-ui-protocol-series-part-2/index.md

[... similar for other posts ...]

📊 PUBLISHING SUMMARY
====================
📅 Date: 2025-06-17
✅ Posts published: 4
⏳ Posts skipped (future dates): 0
❌ Posts with errors: 0
```

## Troubleshooting

### If the test fails:
1. **Check the logs** in GitHub Actions for specific error messages
2. **Verify file permissions** - the workflow needs write access
3. **Check branch protection** rules - might prevent automated commits
4. **Verify GITHUB_TOKEN** has sufficient permissions

### If posts don't publish:
1. **Check date format** in frontmatter (must be YYYY-MM-DD)
2. **Verify `draft: true`** line format (no extra spaces)
3. **Check file paths** - must be in `main-docs/blog/*/index.md`

## Safe Testing Strategy

### Option A: Test on a Branch
```bash
# Create test branch
git checkout -b test-auto-publish
# Workflow will run on this branch
# Verify it works before merging to main
```

### Option B: Temporarily Modify Test Dates
```bash
# Change one post's date to today for testing
# Test the workflow
# Change it back if needed
```

## Production Readiness Checklist

- [ ] Manual trigger test passes without syntax errors
- [ ] Local script test shows expected posts would be published  
- [ ] Workflow summary shows correct number of posts processed
- [ ] File changes are committed and pushed correctly
- [ ] No unexpected errors in the logs
- [ ] All draft posts dated ≤ today are published
- [ ] Future-dated posts remain as drafts

Once these tests pass, your GitHub Action is ready for production use!