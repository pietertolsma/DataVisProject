import pandas as pd
import json
import pycountry

avg_income_path = "../raw_data/income_Data.csv"
min_wage_path = "../raw_data/minwage_data.csv"
EU_support_path = "../raw_data/EU_spending_and_revenue.csv"
GDP_path = "../raw_data/gdp_Data.csv"
tourism_path = "../raw_data/Tourism_statistics_2019data.csv"
population_path = "../raw_data/demo_pjan_1_Data.csv"
# Possible other paths

avg_income_df = pd.read_csv(avg_income_path, error_bad_lines=False)
minwage_df = pd.read_csv(min_wage_path, error_bad_lines=False)
EU_support_df = pd.read_csv(EU_support_path, sep=';', error_bad_lines=False)
GDP_df = pd.read_csv(GDP_path, error_bad_lines=False)
tourism_df = pd.read_csv(tourism_path, sep=';', error_bad_lines=False)
population_df = pd.read_csv(population_path, error_bad_lines=False)


def process_income(df):
    df = df[df["TIME"] == 2019]
    df = df[df["AGE"] == "Total"]
    df = df[~df.UNIT.str.contains("National currency")]
    df = df[~df.UNIT.str.contains("PPS")]

    totalEU_df = df[df["GEO"] == "European Union - 28 countries (2013-2020)"]

    df = df[~df.GEO.str.contains("European Union")]
    df = df[~df.GEO.str.contains("Euro area")]

    df = df.append(totalEU_df)

    df["Value"] = df["Value"].str.replace(',', '')
    df["Value"] = pd.to_numeric(df["Value"], errors='coerce')

    df.reset_index(inplace=True, drop=True)
    df = df.drop(["Flag and Footnotes", "TIME", "AGE", "SEX", "UNIT", "INDIC_IL"], axis=1)
    df = df.rename(columns={"GEO": "Country", "Value": "avg_income"})

    df["Country"] = df["Country"].replace({"Germany (until 1990 former territory of the FRG)": "Germany",
                                           "Kosovo (under United Nations Security Council Resolution 1244/99)": "Kosovo",
                                           "European Union - 28 countries (2013-2020)": "EU"})
    return df


def process_minwage(df):
    df = df[df.TIME.str.contains("2019")]
    df = df.drop("Flag and Footnotes", axis=1)
    df["Value"] = df["Value"].str.replace(',', '')
    df["Value"] = pd.to_numeric(df["Value"], errors='coerce')
    df = df.groupby("GEO").mean()
    df = df.rename(columns={"Value": "min_wage"})
    df["Country"] = df.index
    df.reset_index(inplace=True, drop=True)

    df["Country"] = df["Country"].replace({"Germany (until 1990 former territory of the FRG)": "Germany",
                                           "Kosovo (under United Nations Security Council Resolution 1244/99)": "Kosovo"})

    df = df[~df.Country.str.contains("United States")]
    df.loc[df.shape[0]] = ["EU",""]

    return df


def process_EU_support(df):
    countries = {}
    for country in pycountry.countries:
        countries[country.alpha_2] = country.name
    countries['EL'] = 'Greece'
    countries['UK'] = 'United Kingdom'

    df_copy = df.copy()
    row = df_copy.iloc[0].str.strip().replace(countries)
    df = df.transpose()
    df.columns = df.iloc[0]
    df["Country"] = row
    df = df.iloc[1:, :]
    df.reset_index(inplace=True, drop=True)

    df["Country"] = df["Country"].replace({"EU-28": "EU"})

    new_df = df[["Country", "SMART AND INCLUSIVE GROWTH", "SUSTAINABLE GROWTH: NATURAL RESOURCES",
                 "SECURITY AND CITIZENSHIP", "GLOBAL EUROPE", "ADMINISTRATION", "SPECIAL INSTRUMENTS",
                 "VAT-based own resource", "GNI-based own resource", "Traditional own resources (TOR) (80%)",
                 "TOTAL own resources", "Other revenue***"]].copy()

    cols = new_df.columns
    new_df[cols] = new_df[cols].apply(lambda x: x.str.replace('.',''))
    new_df[cols] = new_df[cols].apply(lambda x: x.str.replace(',','.'))
    new_df[cols] = new_df[cols].apply(pd.to_numeric, errors='ignore')

    return new_df


def process_GDP(df):
    df = df[df["TIME"] == 2019]
    df = df[df["UNIT"] == "Current prices, million euro"]
    df["Value"] = df["Value"].str.replace(',', '')
    df["Value"] = pd.to_numeric(df["Value"], errors='coerce')
    totalEU_df = df[df["GEO"] == "European Union - 28 countries (2013-2020)"]
    df = df[~df.GEO.str.contains("European Union")]
    df = df[~df.GEO.str.contains("Euro area")]
    df = df.append(totalEU_df)

    df.reset_index(inplace=True, drop=True)
    df = df.drop(["Flag and Footnotes", "TIME", "UNIT", "NA_ITEM"], axis=1)
    df = df.rename(columns={"GEO": "Country", "Value": "GDP"})

    df["Country"] = df["Country"].replace({"Germany (until 1990 former territory of the FRG)": "Germany",
                                           "Kosovo (under United Nations Security Council Resolution 1244/99)": "Kosovo",
                                           "European Union - 28 countries (2013-2020)": "EU"})

    return df


def process_tourism(df):
    df.dropna(how='all', axis=1, inplace=True)
    df.reset_index(inplace=True, drop=True)
    df = df.rename(columns={"Unnamed: 0": "Country", "Receipts ": "Tourism income",
                            "Relative to GDP 2019 (%)": "Tourism income relative to GDP",
                            "Expenditure": "Tourism expenditure",
                            "Relative to GDP 2019 (%).1": "Tourism expenditure relative to GDP",
                            "Balance (million EUR)": "tourism balance"})

    df["Tourism income relative to GDP"] = df["Tourism income relative to GDP"].str.replace(',', '.')
    df["Tourism expenditure relative to GDP"] = df["Tourism expenditure relative to GDP"].str.replace(',', '.')

    cols = df.columns
    df[cols] = df[cols].apply(pd.to_numeric, errors='ignore')

    return df


def process_population(df):
    df = df[df["TIME"] == 2019]
    totalEU_df = df[df["GEO"] == "European Union - 28 countries (2013-2020)"]
    df = df[~df.GEO.str.contains("European")]
    df = df[~df.GEO.str.contains("Euro area")]
    df = df[~df.GEO.str.contains("Germany including former GDR")]
    df = df[~df.GEO.str.contains("France (metropolitan)")]

    df.append(totalEU_df)

    df = df.drop(["Flag and Footnotes", "AGE", "SEX", "TIME", "UNIT"], axis=1)
    df = df.rename(columns={"GEO": "Country", "Value": "Population"})

    df["Country"] = df["Country"].replace({"Germany (until 1990 former territory of the FRG)": "Germany",
                                           "Kosovo (under United Nations Security Council Resolution 1244/99)": "Kosovo",
                                           "European Union - 28 countries (2013-2020)": "EU"})

    df["Population"] = df["Population"].str.replace(' ', '')

    df.reset_index(inplace=True, drop=True)

    return df


filtered_avg_income_df = process_income(avg_income_df)
filtered_minwage_df = process_minwage(minwage_df)
filtered_EU_support_df = process_EU_support(EU_support_df)
filtered_GDP_df = process_GDP(GDP_df)
filtered_tourism_df = process_tourism(tourism_df)
filtered_population_df = process_population(population_df)

total_df = pd.merge(filtered_population_df, filtered_minwage_df, how="outer", on=["Country"])
total_df = pd.merge(total_df, filtered_GDP_df, how="outer", on=["Country"])
total_df = pd.merge(total_df, filtered_avg_income_df, how="outer", on=["Country"])
total_df = pd.merge(total_df, filtered_EU_support_df, how="inner", on=["Country"])
total_df = pd.merge(total_df, filtered_tourism_df, how="inner", on=["Country"])


# Uncomment to create dataset files
total_df.to_csv("../merged_new_data.csv")
total_df.to_json("../merged_new_data.json", orient="records")
