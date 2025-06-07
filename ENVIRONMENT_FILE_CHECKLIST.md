# 🚨 ENVIRONMENT FILE VERIFICATION CHECKLIST

## **MANDATORY PROTOCOL - RUN BEFORE ANY ENV VAR WORK**

### **Step 1: Verify Root .env File**
```bash
ls -la | grep env
```
**Expected Output:**
```
-rw-r--r--@ 1 user staff 1040 Jun 6 08:44 .env
```

### **Step 2: Check Contents**
```bash
cat .env | grep EXPO_PUBLIC
```
**Expected Variables:**
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### **Step 3: Verify Apps/Web Copy Process**
```bash
cd apps/web && ls -la | grep env
```
**Note:** May not exist until build runs `cp ../../.env .env`

### **Step 4: Check Package.json Scripts**
```bash
grep -r "cp.*\.env" apps/web/package.json
```
**Expected:** Copy command in web script

---

## **FAILURE PREVENTION RULES**

### **❌ NEVER DO:**
- Claim .env file doesn't exist without running `ls -la`
- Use `list_dir` tool to check for hidden files
- Assume environment files don't exist if `read_file` fails
- Proceed with env var debugging without verification

### **✅ ALWAYS DO:**
- Run `ls -la | grep env` FIRST
- Use `cat .env` if `read_file` tool fails
- Check both root and apps/web directories
- Verify file contents before claiming missing variables

---

## **COMMON MISTAKES TO AVOID**

1. **Hidden File Blindness**: `.env` files are hidden, need `ls -la`
2. **Tool Limitations**: `read_file` may fail on gitignored files
3. **Directory Confusion**: Root `.env` vs `apps/web/.env`
4. **Build Process Ignorance**: Files get copied during build

---

## **EMERGENCY RECOVERY**

If you've already claimed .env doesn't exist:
1. Immediately run verification commands
2. Acknowledge the mistake
3. Use `cat .env` to show contents
4. Update documentation with correct information
5. Add this incident to failure prevention docs
