def longestPalindrome(s: str) -> str:
    """
    Finds the longest palindromic substring using the Expand Around Center method.
    This version avoids using the 'nonlocal' keyword.
    """
    if not s or len(s) < 1:
        return ""

    start = 0
    end = 0

    # The helper function is now outside the main function, which is a common pattern.
    # It takes the string and the center pointers as arguments.
    def expand_around_center(s: str, left: int, right: int) -> int:
        # Expand while the pointers are in bounds and characters match
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        
        # Return the length of the palindrome found.
        # The palindrome is between (left + 1) and (right - 1).
        # Length = (right - 1) - (left + 1) + 1 = right - left - 1
        return right - left - 1

    # Main loop to iterate through all possible centers
    for i in range(len(s)):
        # Case 1: Odd length palindrome (center is s[i])
        len1 = expand_around_center(s, i, i)

        # Case 2: Even length palindrome (center is between s[i] and s[i+1])
        len2 = expand_around_center(s, i, i + 1)

        # Get the longer of the two palindromes found
        current_max_len = max(len1, len2)

        # Check if this palindrome is the new longest one
        if current_max_len > (end - start):
            # Calculate the new start and end indices for our result
            start = i - (current_max_len - 1) // 2
            end = i + current_max_len // 2
            
    return s[start : end + 1]

# --- Examples ---
s1 = "babad"
print(f'Input: "{s1}"')
print(f'Output: "{longestPalindrome(s1)}"')

print("-" * 20)

s2 = "cbbd"
print(f'Input: "{s2}"')
print(f'Output: "{longestPalindrome(s2)}"')