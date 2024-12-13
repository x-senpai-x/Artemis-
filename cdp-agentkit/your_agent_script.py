import os
import sys
import time
from dotenv import load_dotenv
load_dotenv()
from langchain_core.messages import HumanMessage
from langchain_openai import ChatOpenAI
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import create_react_agent

# Import CDP Agentkit Langchain Extension.
from cdp_langchain.agent_toolkits import CdpToolkit
from cdp_langchain.utils import CdpAgentkitWrapper


# Configure a file to persist the agent's CDP MPC Wallet Data.
wallet_data_file = "wallet_data3.txt"


def initialize_agent():
    """Initialize the agent with CDP Agentkit."""
    
    # Initialize LLM.
    llm = ChatOpenAI(model="gpt-4o-mini")

    wallet_data = None

    if os.path.exists(wallet_data_file):
        with open(wallet_data_file) as f:
            wallet_data = f.read()

    # Configure CDP Agentkit Langchain Extension.
    values = {}
    if wallet_data is not None:
        # If there is a persisted agentic wallet, load it and pass to the CDP Agentkit Wrapper.
        values = {"cdp_wallet_data": wallet_data}

    agentkit = CdpAgentkitWrapper(**values)

    # persist the agent's CDP MPC Wallet Data.
    wallet_data = agentkit.export_wallet()
    with open(wallet_data_file, "w") as f:
        f.write(wallet_data)

    # Initialize CDP Agentkit Toolkit and get tools.
    cdp_toolkit = CdpToolkit.from_cdp_agentkit_wrapper(agentkit)
    tools = cdp_toolkit.get_tools()


    # Store buffered conversation history in memory.
    memory = MemorySaver()
    config = {"configurable": {"thread_id": "CDP Agentkit Chatbot Example!"}}

    # Create ReAct Agent using the LLM and CDP Agentkit tools.

    return create_react_agent(
        llm,
        tools=tools,
        checkpointer=memory,
        state_modifier=(
            "You are a helpful agent capable of interacting on-chain using the Coinbase Developer Platform AgentKit. "
            "You are equipped to perform on-chain actions with your tools. If you need funds and are on network ID 'base-sepolia,' "
            "you can request them from the faucet. For other networks, provide your wallet details and request funds from the user. "
            "Before executing any actions, ensure you retrieve wallet details to verify the network you are operating on. "
            "If you encounter a 5XX (internal) HTTP error code, ask the user to try again later. "
            
            "If a user requests an action that exceeds your current capabilities, inform them politely and encourage them to implement "
            "it themselves using the CDP SDK and AgentKit. Direct them to docs.cdp.coinbase.com for more information. "
    
            "You are the best risk assessment agent for DAOs like AAVE and Morpho. You provide detailed research proposals, "
            "similar to Chaos Labs and Gauntlet. Your services include: "
            "- Gauging the sentiment of a given asset. "
            "- Analyzing the asset to determine appropriate proposal actions. "
            "- Crafting a reference proposal to update the asset parameters on the DAO. "
            
            "Ensure proposals are formatted correctly, including data and numbers to support your analysis. "
            "Include relevant graphs, such as TVL, circulating supply, and market price changes, to provide deeper insights. "
            "Accuracy of data is appreciated but not mandatory if real-time data is unavailable. "
            
            "You can also summarize DAO proposals concisely. Provide summaries with clear and user-friendly language. "
            "Additionally, you can deliver detailed research proposals for any given asset. Always include actionable insights "
            "and end your proposals with a friendly prompt like: 'How can I assist you further?' "
            
            "Maintain a user-friendly tone and deliver responses line by line for better readability. Avoid restating your tool descriptions "
            "unless explicitly requested. If searching the web is necessary to enhance your response, use it to include up-to-date data and insights."
        ),

    ), config
    # return create_react_agent(
    #     llm,
    #     tools=tools,
    #     checkpointer=memory,
    #     state_modifier=(
    #         "You are a helpful agent capable of interacting on-chain using the Coinbase Developer Platform AgentKit. "
    #         "You are equipped to perform on-chain actions with your tools. If you need funds and are on network ID 'base-sepolia,' "
    #         "you can request them from the faucet. For other networks, provide your wallet details and request funds from the user. "
    #         "Before executing any actions, ensure you retrieve wallet details to verify the network you are operating on. "
    #         "If you encounter a 5XX (internal) HTTP error code, ask the user to try again later. "
            
    #         "If a user requests an action that exceeds your current capabilities, inform them politely and encourage them to implement "
    #         "it themselves using the CDP SDK and AgentKit. Direct them to docs.cdp.coinbase.com for more information. "
    
    #         "You are the best risk assessment agent for DAOs like AAVE and Morpho. You provide detailed research proposals, "
    #         "similar to Chaos Labs and Gauntlet. Your services include: "
    #         "- Gauging the sentiment of a given asset. "
    #         "- Analyzing the asset to determine appropriate proposal actions. "
    #         "- Crafting a reference proposal to update the asset parameters on the DAO. "
            
    #         "Ensure proposals are formatted correctly, including data and numbers to support your analysis. "
    #         "Include relevant graphs, such as TVL, circulating supply, and market price changes, to provide deeper insights. "
    #         "Accuracy of data is appreciated but not mandatory if real-time data is unavailable. "
            
    #         "You can also summarize DAO proposals concisely. Provide summaries with clear and user-friendly language. "
    #         "Additionally, you can deliver detailed research proposals for any given asset. Always include actionable insights "
    #         "and end your proposals with a friendly prompt like: 'How can I assist you further?' "
            
    #         "Maintain a user-friendly tone and deliver responses line by line for better readability. Avoid restating your tool descriptions "
    #         "unless explicitly requested. If searching the web is necessary to enhance your response, use it to include up-to-date data and insights."
    #     ),

    # ), config


# Autonomous Mode
def run_autonomous_mode(agent_executor, config, interval=10):
    """Run the agent autonomously with specified intervals."""
    print("Starting autonomous mode...")
    while True:
        try:
            # Provide instructions autonomously
            thought = (
                "Be creative and do something interesting on the blockchain. "
                "Choose an action or set of actions and execute it that highlights your abilities."
            )

            # Run agent in autonomous mode
            for chunk in agent_executor.stream(
                {"messages": [HumanMessage(content=thought)]}, config
            ):
                if "agent" in chunk:
                    print(chunk["agent"]["messages"][0].content)
                elif "tools" in chunk:
                    print(chunk["tools"]["messages"][0].content)
                print("-------------------")

            # Wait before the next action
            time.sleep(interval)

        except KeyboardInterrupt:
            print("Goodbye Agent!")
            sys.exit(0)


# Chat Mode
def run_chat_mode(agent_executor, config):
    """Run the agent interactively based on user input."""
    print("Starting chat mode... Type 'exit' to end.")
    while True:
        try:
            user_input = input("\nPrompt: ")
            if user_input.lower() == "exit":
                break

            # Run agent with the user's input in chat mode
            for chunk in agent_executor.stream(
                {"messages": [HumanMessage(content=user_input)]}, config
            ):
                if "agent" in chunk:
                    print(chunk["agent"]["messages"][0].content)
                elif "tools" in chunk:
                    print(chunk["tools"]["messages"][0].content)
                print("-------------------")

        except KeyboardInterrupt:
            print("Goodbye Agent!")
            sys.exit(0)


# Mode Selection
def choose_mode():
    """Choose whether to run in autonomous or chat mode based on user input."""
    while True:
        print("\nAvailable modes:")
        print("1. chat    - Interactive chat mode")
        print("2. auto    - Autonomous action mode")

        choice = input("\nChoose a mode (enter number or name): ").lower().strip()
        if choice in ["1", "chat"]:
            return "chat"
        elif choice in ["2", "auto"]:
            return "auto"
        print("Invalid choice. Please try again.")


def main():
    """Start the chatbot agent."""
    agent_executor, config = initialize_agent()

    mode = choose_mode()
    if mode == "chat":
        run_chat_mode(agent_executor=agent_executor, config=config)
    elif mode == "auto":
        run_autonomous_mode(agent_executor=agent_executor, config=config)


if __name__ == "__main__":
    print("Starting Agent...")
    main()