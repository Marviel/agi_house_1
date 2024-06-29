from langchain_anthropic import ChatAnthropic
from langchain_core.messages import AIMessage, HumanMessage

model = ChatAnthropic(model="claude-3-opus-20240229", temperature=0, max_tokens=1024)