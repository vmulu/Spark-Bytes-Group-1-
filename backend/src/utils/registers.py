from src.models.account_model import Account
from src.models.inbox_model import Inbox
from src.models.lead_model import Lead
from src.prompt.chat_model import ChatModel, OpenAIModel
from src.supabase.supabase_manager import SupabaseManager
from src.supabase.supabase_register import SupabaseRegister
from src.utils.register import Register, TypedRegisterRegister

# A special-case of a register for supabase tables. This allows us to interact
# with supabase tables in a "typed" manner.
SUPABASE_REGISTER = SupabaseRegister({
    Account: SupabaseManager[Account]("accounts", Account),
    Inbox: SupabaseManager[Inbox]("inbox", Inbox),
    Lead: SupabaseManager[Lead]("leads", Lead),
})


# Stores all registers in one spot. You can get a register by type, so you can
# grab a register by the type of object you want to get. For example,
# REGISTERS[ChatModel] will return a register that can get ChatModel objects.
REGISTERS = TypedRegisterRegister()

# A register to get a ChatModel object by name of the model
REGISTERS[ChatModel] = Register[ChatModel]({
    "gpt-4o-mini": OpenAIModel(model="gpt-4o-mini"),
})
