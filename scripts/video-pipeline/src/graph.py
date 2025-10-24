"""LangGraph pipeline construction."""
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver

from .state import PipelineState, InputState, OutputState
from .nodes.input_node import input_node
from .nodes.video_analysis_node import video_analysis_node
from .nodes.image_decision_node import image_decision_node
from .nodes.extract_images_node import extract_images_node
from .nodes.content_generation_node import content_generation_node
from .nodes.fact_check_node import fact_check_node
from .nodes.human_review_node import human_review_node
from .nodes.pr_generation_node import pr_generation_node


def build_graph():
    """Build and compile the video content pipeline graph.

    Returns:
        Compiled LangGraph instance ready for invocation
    """
    # Create graph builder with state schemas
    builder = StateGraph(
        state_schema=PipelineState,
        input_schema=InputState,
        output_schema=OutputState
    )

    # Add nodes
    builder.add_node("input", input_node)
    builder.add_node("video_analysis", video_analysis_node)
    builder.add_node("image_decision", image_decision_node)
    builder.add_node("extract_images", extract_images_node)
    builder.add_node("content_generation", content_generation_node)
    builder.add_node("fact_check", fact_check_node)
    builder.add_node("human_review", human_review_node)
    # Stub node for future auto_correct routing
    builder.add_node("auto_correct", lambda state: state)
    builder.add_node("pr_generation", pr_generation_node)

    # Add edges
    builder.add_edge(START, "input")
    builder.add_edge("input", "video_analysis")
    builder.add_edge("video_analysis", "image_decision")
    # image_decision uses Command to route to extract_images or content_generation
    builder.add_edge("extract_images", "content_generation")
    builder.add_edge("content_generation", "fact_check")
    builder.add_edge("fact_check", "human_review")
    # human_review uses Command to route to pr_generation, auto_correct, or END
    builder.add_edge("auto_correct", "pr_generation")
    builder.add_edge("pr_generation", END)

    # Compile with checkpointer for resumability
    checkpointer = MemorySaver()
    graph = builder.compile(checkpointer=checkpointer)

    return graph
