<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class ErrorPagesTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();

        Route::middleware('web')->get('/__testing/abort/{code}', function (int $code) {
            abort($code);
        });
    }

    public function test_unknown_route_renders_branded_404_page(): void
    {
        $response = $this->get('/this-page-does-not-exist');

        $response->assertNotFound();
        $response->assertSee('This page drifted away', false);
        $response->assertSee('error-illustration', false);
        $response->assertSee('404', false);
        $response->assertSee('Go home', false);
    }

    #[DataProvider('brandedErrorPages')]
    public function test_http_errors_render_branded_pages(int $status, string $heading): void
    {
        $response = $this->get('/__testing/abort/'.$status);

        $response->assertStatus($status);
        $response->assertSee($heading, false);
        $response->assertSee('error-illustration', false);
        $response->assertSee((string) $status, false);
    }

    /**
     * @return array<string, array{int, string}>
     */
    public static function brandedErrorPages(): array
    {
        return [
            'unauthorized' => [401, 'A key is required'],
            'forbidden' => [403, 'This gate stays shut'],
            'not found' => [404, 'This page drifted away'],
            'page expired' => [419, 'Time ran out'],
            'too many requests' => [429, 'Too much traffic'],
            'server error' => [500, 'Something came unplugged'],
            'service unavailable' => [503, 'Closed for a tune-up'],
        ];
    }
}
