export enum DataStateEnum
{
  LOADING,
  LOADED,
  ERROR
}
  export enum ProjectActionTypes{
    Filtre_Projets="projets_filres",
    Filtre_Non_Projets="projets_Non_filres",
    GET_SELECTED_PRODUCTS="[Product] Get Selected products",
    GET_AVAILABLE_PRODUCTS="[Product] Get Available products",
    SEARCH_PRODUCTS="[Product] Search products",
    NEW_PRODUCT="[Product] New product",

    //événements pour productList :
    SELECT_PRODUCT="[Product] Select product",
    EDIT_PRODUCT="[ Product] Edit product",
    DELETE_PRODUCT="[Product] Delete product"
  }
export interface ActionEvent{
  // cette interface est crée pour gérer les cas des evenements
  // ou il faut transmettre des valeurs (search par expl)
  // cet valeur passé est appelé payload
  type:ProjectActionTypes;
  payload?:any;
}

export interface AppDataState<T>{
  dataState?:DataStateEnum,
  data?:T,
  errorMessage?:string
}
