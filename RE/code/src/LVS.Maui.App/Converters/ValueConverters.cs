using System.Globalization;

namespace LVS.Maui.App.Converters;

public class NullToBoolConverter : IValueConverter
{
    /// <summary>Returns true if the value is null.</summary>
    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
        => value is null;

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
        => throw new NotSupportedException();
}

public class NotNullToBoolConverter : IValueConverter
{
    /// <summary>Returns true if the value is not null.</summary>
    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
        => value is not null;

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
        => throw new NotSupportedException();
}

public class InvertBoolConverter : IValueConverter
{
    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
        => value is bool b ? !b : value;

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
        => value is bool b ? !b : value;
}

public class StringNotEmptyConverter : IValueConverter
{
    /// <summary>Returns true if the string is not null or empty.</summary>
    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
        => value is string s && !string.IsNullOrEmpty(s);

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
        => throw new NotSupportedException();
}

public class DateFormatConverter : IValueConverter
{
    /// <summary>Formats a DateTime. Parameter is the format string (default "yyyy-MM-dd").</summary>
    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        if (value is DateTime dt)
        {
            var format = parameter as string ?? "yyyy-MM-dd";
            return dt.ToString(format, culture);
        }
        return value?.ToString();
    }

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
        => throw new NotSupportedException();
}
