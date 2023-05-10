import jdatetime
from datetime import datetime
import requests
from bs4 import BeautifulSoup
#from .models import ProductPerformance
import numpy as np
from itertools import product
#import matplotlib.pyplot as plt
from statsmodels.tsa.api import ExponentialSmoothing, SimpleExpSmoothing, Holt
from scipy.stats import norm


from reportlab.lib import colors
from reportlab.platypus import Table, TableStyle
from reportlab.lib.pagesizes import landscape, A5
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
import datetime
from reportlab.platypus import Paragraph
from reportlab.lib.styles import getSampleStyleSheet

def wrap_text(text, style):
    return Paragraph(text, style)

def create_receipt_pdf(filename, title, items, logo_path):
    pdf = canvas.Canvas(filename, pagesize=landscape(A5))

    pdf.drawImage(logo_path, 10 * mm, 125 * mm, preserveAspectRatio=True, width=40 * mm, height=20 * mm)
    pdf.setFont("Helvetica-Bold", 18)
    pdf.drawCentredString(105 * mm, 135 * mm, title)

    date_str = datetime.datetime.now().strftime("%d-%m-%Y")
    pdf.setFont("Helvetica", 12)
    pdf.drawRightString(200 * mm, 135 * mm, f"Tarih: {date_str}")

    data = [["Malzeme Kodu", "Malzeme Adi", "Adet", "Birim"]]
    data.extend(items)

    style = getSampleStyleSheet()["BodyText"]

    wrapped_data = [[wrap_text(str(cell), style) for cell in row] for row in data]

    table = Table(wrapped_data, colWidths=[50 * mm, 80 * mm, 20 * mm, 30 * mm])

    table.setStyle(TableStyle([
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))

    table.wrapOn(pdf, 0, 0)
    table.drawOn(pdf, 15 * mm, 50 * mm)

    # Add signatures
    pdf.setFont("Helvetica", 10)
    signature_positions = [
        (15 * mm, 40 * mm, "Malzemeyi Talep Eden"),
        (60 * mm, 40 * mm, "Malzemeyi Teslim Alan"),
        (105 * mm, 40 * mm, "Malzemeyi Teslim Eden"),
        (150 * mm, 40 * mm, "Ambar Sorumlusu"),
    ]
    
    for x, y, text in signature_positions:
        pdf.drawString(x, y, text)
        pdf.line(x, y - 2 * mm, x + 40 * mm, y - 2 * mm)

    pdf.save()








# # Example usage
# items = [
#     ("001.001.999", "Product 1", 300, "kg"),
#     ("002", "Product 2", 1, "kg"),
#     ("003", "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", 3, "kg")
# ]

# logo_path = "path/to/your/logo.png"
# title = "Ambar Malzeme Cikis Fisi"

# create_receipt_pdf("receipt.pdf", title, items, "C://Users//yasin//OneDrive/Masaüstü/koz_logo.png")

# def jalali_to_greg(day,month,year):
#     gregorian_date = jdatetime.date(year,month,day).togregorian()
#     return gregorian_date

# def greg_to_jalali(year,month,day):
#     jalili_date =  jdatetime.date.fromgregorian(day=day,month=month,year=year)
#     return jalili_date

# def current_jalali_date():
#      current_date = datetime.now().date()
#      jalali_current_date = greg_to_jalali(current_date.year,current_date.month,current_date.day)

#      return jalali_current_date

# def calculate_experience_rating(job_start_date):
#     current_date = datetime.now().date()
#     jalali_current_date = greg_to_jalali(current_date.year,current_date.month,current_date.day)
#     year_diff = jalali_current_date.year - job_start_date.year
#     month_diff = jalali_current_date.month - job_start_date.month
#     total_diff = (month_diff + (year_diff * 12))/12
    
#     if total_diff > 5:
#         return 1.30
#     elif 3 <= total_diff <= 5:
#         return 1.15
#     elif 1 <= total_diff < 3:
#         return 1.05
#     else:
#         return 1.00

# def calculate_passive_saler_experience_rating(job_start_date):
#     current_date = datetime.now().date()
#     jalali_current_date = greg_to_jalali(current_date.year,current_date.month,current_date.day)
#     year_diff = jalali_current_date.year - job_start_date.year
#     month_diff = jalali_current_date.month - job_start_date.month
#     total_diff = (month_diff + (year_diff * 12))/12
    
#     if total_diff > 3:
#         return 1.30
#     elif 2 <= total_diff <= 3:
#         return 1.2
#     elif 1 <= total_diff < 2:
#         return 1.1
#     else:
#         return 1.00

# def the_man_from_future(job_start_date):
#     current_date = datetime.now().date()
#     jalali_current_date = greg_to_jalali(current_date.year,current_date.month,current_date.day)
#     year_diff = jalali_current_date.year - job_start_date.year
#     month_diff = jalali_current_date.month - job_start_date.month
#     total_diff = (month_diff + (year_diff * 12))/12
    
#     if total_diff < 0:
#         return True
#     else:
#         return False

# def calculate_sale_rating(sale_amount):
#     print("sale_amount: ",sale_amount)
#     if 1000 <= sale_amount:
#         return 1.30
#     elif 750 <= sale_amount < 1000:
#         return 1.20
#     elif 500 <= sale_amount < 750:
#         return 1.10
#     else:
#         return 1.00



# def get_exchange_rate():
#     url = "https://www.xe.com/currencyconverter/convert/?Amount=1&From=USD&To=IRR"
#     response = requests.get(url)
#     soup = BeautifulSoup(response.text, 'html.parser')

#     rate_element = soup.find("p", class_="result__BigRate-sc-1bsijpp-1 iGrAod")
#     rate_text = rate_element.text
#     rate_value = rate_text.split(" ")[0].replace(",", "")
#     rate_float = float(rate_value)
#     rounded_rate = round(rate_float, 2)

#     return rounded_rate



# # region Model Analyze
# def filter_product_sales(product_sales, product_code, dim=3):
#     return [sb_lst[dim] == product_code if len(sb_lst) > dim else False for sb_lst in product_sales]
# def remove_product_sales_by_boolean(product_sales, bool_lst):
#     return [elem for elem, bool_val in zip(product_sales, bool_lst) if bool_val]
# def generate_year_month_sequence(start_year, start_month, end_year, end_month):
#     years = range(int(start_year), int(end_year) + 1)
#     months = range(1, 13)
#     return [(year, month) for year, month in product(years, months) if (int(year), int(month)) >= (int(start_year), int(start_month)) and (int(year), int(month)) <= (int(end_year), int(end_month))]
# def convert_daily_to_monthly(daily_sales):
#     daily_sales.sort(key=lambda x: (x[2], x[1], x[0]))  # Sort daily sales by date

#     _, start_month, start_year, _, _ = daily_sales[0]
#     _, end_month, end_year, _, _ = daily_sales[-1]
#     year_month_sequence = generate_year_month_sequence(start_year, start_month, end_year, end_month)
#     monthly_sales_dict = {year_month: 0 for year_month in year_month_sequence}
#     for sale in daily_sales:
#         day, month, year, _, daily_sale = sale
#         key = (year, month)
#         monthly_sales_dict[key] += daily_sale
#     monthly_sales = [[month, year, total_sales] for (month, year), total_sales in monthly_sales_dict.items()]
#     return monthly_sales
# def fill_product_sales(product_sales,product_code):
#     year_dif = product_sales[-1][1] - product_sales[0][1] + 1
#     for i in range(year_dif * 12):
#         if not(product_sales[i][0]==(i%12+1)):
#             product_sales.insert(i,[(i%12+1),product_sales[0][1]+int(i/12),product_code,0])
#     return product_sales
# def get_sale_array(product_sales, dim):
#     return [sublist[dim] for sublist in product_sales]
# def forecast_by_average(sales, prev_forecast_period, future_forecast_period):
#     ave = np.mean(sales[-prev_forecast_period:])
#     return [ave for _ in range(future_forecast_period)]
# def forecast_by_exp(sales, prev_forecast_period, future_forecast_period):
#     fit_data = SimpleExpSmoothing(sales, initialization_method = "estimated").fit()
#     forecast = fit_data.forecast(future_forecast_period)
#     return forecast
# def forecast_by_holt(sales, prev_forecast_period, future_forecast_period):
#     bool_optimize = len(sales) > 6
#     test_size = 3
#     optimal_sl = 0.8
#     optimal_st = 0.2
#     if bool_optimize:
#         sales_train = sales[:-test_size]
#         sales_test = sales[-test_size:]
#         SL_RANGE = np.logspace(-1,0,20)
#         ST_RANGE = np.logspace(-1,0,20)
#         errors = []
#         for sl in SL_RANGE:
#             for st in ST_RANGE:
#                 fit_data = Holt(sales_train, initialization_method = "estimated").fit(smoothing_level=sl, smoothing_trend=st, optimized=False)
#                 forecast_test = fit_data.forecast(test_size)
#                 errors.append([sl,st,sum(abs(forecast_test-sales_test))])
#         min_val = min(row[2] for row in errors)
#         min_index = [row[2] for row in errors].index(min_val)
#         optimal_sl = errors[min_index][0]
#         optimal_st = errors[min_index][1]
#     fit_data = Holt(sales, initialization_method = "estimated").fit(smoothing_level=optimal_sl, smoothing_trend=optimal_st, optimized=False)
#     forecast = fit_data.forecast(future_forecast_period)
#     return forecast
# def simulate_future_stocks(current_stock, future_sales):
#     future_stocks = []
#     future_stocks.append(current_stock)
#     for sls in future_sales:
#         future_stocks.append(future_stocks[-1]-sls)
#     return future_stocks
# def create_service_level_service_factor(service_level):
#     # Calculate the inverse of the standard normal cumulative distribution function
#     # for a given probability value
#     return norm.ppf(service_level)
# def dynamic_correction(monthly_sales, current_date):
#     last_year = monthly_sales[-1][0]
#     last_month = monthly_sales[-1][1]
#     current_year = current_date[0]
#     current_month = current_date[1]
#     current_day = current_date[2]
#     MAX_DAY = 30
#     if current_year != last_year or current_month != last_month:
#         year_month_sequence = generate_year_month_sequence(last_year, last_month, current_year, current_month)
#         year_month_sequence = year_month_sequence[1:]
#         for ii in range(len(year_month_sequence)):
#             element = list(year_month_sequence[ii])
#             element.append(0)
#             year_month_sequence[ii] = element
#         monthly_sales = monthly_sales + year_month_sequence
#     else:
#         monthly_sales[-1] = MAX_DAY * monthly_sales[-1] / current_day
#     return monthly_sales
# def get_model(model, is_dynamic, current_date, product_code, product_sales, current_stock, lead_time, service_level, prev_forecast_period, future_forecast_period):
#     lead_time = lead_time
#     service_level = service_level
#     bools = filter_product_sales(product_sales, product_code, dim=3)
#     product_sales = remove_product_sales_by_boolean(product_sales, bools)
#     monthly_sales = convert_daily_to_monthly(product_sales)
#     if is_dynamic:
#         monthly_sales = dynamic_correction(monthly_sales, current_date)
#     prev_sales = get_sale_array(monthly_sales, dim=2)
#     if model == 'average':
#         future_sales = forecast_by_average(prev_sales,prev_forecast_period, future_forecast_period)
#     elif model == 'holt':
#         future_sales = forecast_by_holt(prev_sales,prev_forecast_period, future_forecast_period)
#     elif model == 'exp':
#         future_sales = forecast_by_exp(prev_sales,prev_forecast_period, future_forecast_period)
#     future_stocks = simulate_future_stocks(current_stock,future_sales)
#     all_sales = np.concatenate((prev_sales, future_sales))
#     print("service_level: ",create_service_level_service_factor(service_level) )
#     safety_stock = create_service_level_service_factor(service_level) * np.std(all_sales)

#     order_flag = any(num < safety_stock for num in future_stocks[0:lead_time])
#     rop = sum(future_sales[0:lead_time]) + safety_stock
#     base_stock_level = safety_stock + (future_sales[0] * lead_time)
#     order = max(base_stock_level - current_stock, 0)
#     order = round(order,2)
#     return all_sales, prev_sales, future_sales, future_stocks, order_flag, safety_stock, rop, order

# def generate_future_forecast_dates(num_months):
#     current_date = current_jalali_date()
#     print("current_date: ", current_date)
#     future_dates_with_current = [current_date]
#     future_dates = []

#     for i in range(0, num_months):
        
#         last_date = future_dates_with_current[-1]
#         month = int(last_date.month) + 1
#         year = last_date.year
#         if month > 12:
#             month = 1
#             year += 1
#         future_dates_with_current.append(jdatetime.date(year, month, 1))
#         future_dates.append(jdatetime.date(year, month, 1))

#     print("future_dates: ", [date.strftime('%Y-%m-%d') for date in future_dates])
#     return [date.strftime('%Y-%m-%d') for date in future_dates]

# # product_code = 15202103
# # #product_sales = np.load('/Users/myurt/Downloads/data_array_numpy.npy')
# # product_sales = [[1,1,1400,1,900],
# #  [1,2,1400,1,1000],
# #  [1,3,1400,1,1290],
# #  [1,4,1400,1,1200],
# #  [1,5,1400,1,1480],
# #  [1,6,1400,1,750],
# #  [2,6,1400,1,1000],
# #  [1,7,1400,1,500],
# #  [2,7,1400,1,600],
# #  [3,7,1400,1,700],
# #  [1,6,1400,2,5000],
# #  [1,8,1400,1,1950],
# #  [1,9,1400,1,1250],
# #  [1,10,1400,1,1799],
# #  [1,11,1400,1,1650],
# #  [1,12,1400,1,1600],
# #  [1,1,1401,1,2000]]
# # product_code = 1
# # product_sales = [[int(num) for num in product_sale] for product_sale in product_sales]
# # #product_sales = [[1, 1400, 1, 55000.0], [3, 1400, 3, 57000.0], [4, 1400, 1, 58000.0], [5, 1400, 2, 59000.0], [6, 1400, 3, 60000.0], [7, 1400, 1, 61000.0], [8, 1400, 2, 62000.0], [9, 1400, 3, 63000.0], [10, 1400, 1, 64000.0], [11, 1400, 2, 65000.0], [12, 1400, 3, 54000.0], [2, 1400, 2, 55800.0], [1, 1401, 3, 174000.0], [2, 1401, 1, 175000.0], [3, 1401, 2, 176000.0], [4, 1401, 3, 177000.0], [5, 1401, 1, 178000.0], [6, 1401, 2, 179000.0], [7, 1401, 3, 180000.0], [8, 1401, 1, 181000.0], [9, 1401, 2, 182000.0], [10, 1401, 3, 183000.0], [11, 1401, 1, 184000.0], [12, 1401, 2, 258500.0], [12, 1401, 3, 97800.0], [12, 1401, 1, 73200.0]]
# # current_stock = 3000
# # lead_time = 3
# # service_level = 99
# # prev_forecast_period = 10
# # future_forecast_period = 3
# # model = 'average'
# # safety_stock = 50
# # is_dynamic = True
# # current_date = [1401,5,18]
# #all_sales, prev_sales, future_sales, future_stocks, order_flag, safety_stock, rop, order = get_model(model, is_dynamic, current_date, product_code, product_sales, current_stock, lead_time, service_level, prev_forecast_period, future_forecast_period)
# # print(prev_sales)
# # print(future_sales)
# # print(future_stocks)
# # print(order_flag)
# # print(rop)
# # print(order)
# # plt.plot(np.linspace(1,len(prev_sales),len(prev_sales)),prev_sales)
# # plt.plot(len(prev_sales)+np.linspace(1,len(future_sales),len(future_sales)),future_sales)
# # endregion