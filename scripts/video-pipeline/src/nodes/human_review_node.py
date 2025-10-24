"""Human review node for approving flagged content."""
from typing import Dict, Any, Literal
from langgraph.types import Command


def human_review_node(
    state: Dict[str, Any]
) -> Command[Literal["pr_generation", "auto_correct", "__end__"]]:
    """Present flagged items for human review if needed.

    Args:
        state: Pipeline state with claims_flagged and fact_check_results

    Returns:
        Command routing to pr_generation, auto_correct, or END
    """
    claims_flagged = state.get("claims_flagged", 0)

    # No issues - proceed automatically
    if claims_flagged == 0:
        return Command(goto="pr_generation")

    # Present flagged items to user
    print("\n" + "="*60)
    print("FACT CHECK REVIEW")
    print("="*60)
    print(f"\n{claims_flagged} items flagged for review:\n")

    for i, result in enumerate(state.get("fact_check_results", []), 1):
        if result.get("status") == "needs_review":
            print(f"{i}. {result.get('claim', 'Unknown claim')}")
            print(f"   Context: {result.get('context', 'N/A')}")
            print(f"   Recommendation: {result.get('recommendation', 'N/A')}\n")

    print("\nOptions:")
    print("  approve - Proceed with PR creation anyway")
    print("  abort   - Stop pipeline and exit")
    print("  correct - Auto-correct flagged items")

    choice = input("\nYour choice: ").strip().lower()

    if choice == "approve":
        return Command(
            goto="pr_generation",
            update={"human_approved": True}
        )
    elif choice == "abort":
        return Command(goto="__end__")
    elif choice == "correct":
        return Command(goto="auto_correct")
    else:
        # Default to abort on invalid input
        print("Invalid choice. Aborting.")
        return Command(goto="__end__")
