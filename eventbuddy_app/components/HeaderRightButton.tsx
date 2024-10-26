import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ActionSheetIOS, TouchableOpacity } from "react-native";

export const HeaderRightButton = () =>
{
    const showActionSheet = () =>
    {
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ['Abbrechen', 'Mehr Freunde hinzufügen', 'Kontakte importieren', 'Freunde einladen'],
                cancelButtonIndex: 0,
            },
            (buttonIndex) =>
            {
                switch (buttonIndex)
                {
                    case 1:
                        router.navigate("/explore");
                        break;
                    case 2:
                        handleImportContacts();
                        break;
                    case 3:
                        handleInviteFriends();
                        break;
                }
            }
        );
    };

    return (
        <TouchableOpacity onPress={showActionSheet}>
            <Ionicons name="add" size={24} color={'#007AFF'} />
        </TouchableOpacity>
    );
};

function handleImportContacts()
{
    throw new Error("Function not implemented.");
}

function handleInviteFriends()
{
    throw new Error("Function not implemented.");
}
