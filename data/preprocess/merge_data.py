import pandas as pd
import json

gdp_file = "../raw_data/gdp.csv"
health_spendings_file = "../raw_data/health.csv"
life_expectancy_file = "../raw_data/life_expectancy.csv"
country_meta_file = "../raw_data/country_meta.csv"
population_file = "../raw_data/population.csv"

gdp_df = pd.read_csv(gdp_file)
health_df = pd.read_csv(health_spendings_file)
life_df = pd.read_csv(life_expectancy_file)
country_df = pd.read_csv(country_meta_file)
population_df = pd.read_csv(population_file)


def process_gdp(df):
    new_data = []
    for index, row in df.iterrows():
        for year in range(1960, 2021):
            entry = {
                "Country Name" : row['Country Name'],
                "Country Code" : row['Country Code'],
                "Year" : year,
                "GDP" : row[str(year)]
            }
            new_data.append(entry)

    return pd.DataFrame.from_dict(new_data)

def process_health(df):
    df = df.rename(columns = {"LOCATION" : "Country Code", "Value" : "Health Spendings", "TIME" : "Year"})
    df = df.loc[df['SUBJECT'] == "TOT"]
    df = df.loc[df["MEASURE"] == "USD_CAP"]
    df = df.drop(["MEASURE", "SUBJECT", 'Flag Codes', "INDICATOR", "FREQUENCY"], axis=1)
    return df

def process_life(df):
    new_data = []
    for index, row in df.iterrows():
        for year in range(1960, 2021):
            entry = {
                "Country Code" : row['Country Code'],
                "Year" : year,
                "Life Expectancy" : row[str(year)]
            }
            new_data.append(entry)
    return pd.DataFrame.from_dict(new_data)

def process_population(df):
    new_data = []
    for index, row in df.iterrows():
        for year in range(1960, 2021):
            entry = {
                "Country Code" : row['Country Code'],
                "Year" : year,
                "Population" : row[str(year)]
            }
            new_data.append(entry)
    return pd.DataFrame.from_dict(new_data)

gdp_df = process_gdp(gdp_df)
health_df = process_health(health_df)
life_df = process_life(life_df)
population_df = process_population(population_df)


total_df = pd.merge(gdp_df, health_df, how="outer", on=["Country Code", "Year"])
total_df = pd.merge(total_df, life_df, how="outer", on=["Country Code", "Year"])
total_df = pd.merge(total_df, population_df, how="outer", on=["Country Code", "Year"])

total_df = total_df.groupby(['Country Name']).apply(lambda x: x[["Year", "Life Expectancy", "Population", "GDP"]].to_dict("records")).reset_index().rename(columns={0:"Data"})

total_df.to_json("../merged_data.json", orient="records")