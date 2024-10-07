import {useParams} from "react-router-dom";

const AssetForm = () => {

  const { id } = useParams<{ id: string }>();

  return <div>Asset: {id}</div>
};

export default AssetForm;