import pandas as pd
from merge_new_data import getCountries

countries = getCountries()
gdp_file = "../raw_data/old_datasets/gdp.csv"
gdp_df = pd.read_csv(gdp_file)

def process_gdp(df):
    new_data = []
    for index, row in df.iterrows():
        for year in range(1960, 2021):
            entry = {
                "Country" : row['Country Name'],
                "Country Code" : row['Country Code'],
                "Year" : year,
                "GDP" : row[str(year)]
            }
            new_data.append(entry)

    # df[pd.DataFrame(df.species.tolist()).isin(selection).any(1).values]

    return pd.DataFrame.from_dict(new_data)


filteredGDPdf = process_gdp(gdp_df)
total_df = filteredGDPdf.groupby(['Country']).apply(lambda x: x[["GDP"]].to_dict("records")).reset_index().rename(columns={0:"Data"})
total_df = pd.merge(countries,total_df,  how="inner", on=["Country"])

total_df.to_csv("../processed_gdp_data.csv")
total_df.to_json("../processed_gdp_data.json", orient="records")
