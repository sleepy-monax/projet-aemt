import { mdiAccountCircle, mdiAccountRemoveOutline, mdiUpdate } from "@mdi/js";
import { useParams } from "react-router-dom";
import Header from "../components/Hearder";
import { FindUserById } from "../services/UserService";
import Button from "../components/Button";
import LinkButton from "../components/LinkButton";

export default function User() {
  let { userId } = useParams();
  let user = FindUserById(userId);

  return (
    <div className="flex-grow flex flex-col items-center">
      <Header
        icon={mdiAccountCircle}
        title={"Compte de l'utilisateur " + user.login}
        description="Modifiez les informations ou supprimez le compte"
      >
        <Button text="Supprimer" icon={mdiAccountRemoveOutline} />
      </Header>
      <div className="my-0 p-8 flex flex-col flex-grow items-center gap-4 max-w-2xl">
        <h1>Nom d'utilisateur : </h1>
        <input
            type="text"
            placeholder="Nom d'utilisateur"
            value={user.login}
        />  
        <h1>Mot de passe : </h1>
        <input
            type="text"
            placeholder="Mot de passe"
            
            value={user.password}
        />  
        <h1>Mot de passe : </h1>
        <input
            type="text"
            placeholder="Role"
            
            value={user.role}
        /> 
        <LinkButton to="/admin" text="Mettre à jour les informations" icon={mdiUpdate} />
      </div>
    </div>
  );
}
