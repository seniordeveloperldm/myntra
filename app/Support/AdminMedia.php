<?php

namespace App\Support;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminMedia
{
    public static function storeUploadedImage(UploadedFile $file, string $directory): string
    {
        $path = $file->store($directory, 'public');

        return '/storage/'.ltrim($path, '/');
    }

    /**
     * @param  array<int, string>|string|null  $images
     */
    public static function deleteManagedImages(array|string|null $images): void
    {
        collect(Arr::wrap($images))
            ->filter()
            ->map(fn ($image) => self::relativePublicPath((string) $image))
            ->filter()
            ->unique()
            ->each(fn ($path) => Storage::disk('public')->delete($path));
    }

    private static function relativePublicPath(string $image): ?string
    {
        $path = parse_url($image, PHP_URL_PATH);

        if (! is_string($path) || ! Str::startsWith($path, '/storage/')) {
            return null;
        }

        return Str::after($path, '/storage/');
    }
}
