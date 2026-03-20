# Skills

## Go

Go is my primary language. I have been writing idiomatic Go for five years — goroutines,
channels, and the `sync` package are second nature to me. I structure projects following
Go module conventions and use `go vet` / `staticcheck` as part of every CI pipeline.
The Go error-handling idiom (`if err != nil`) is something I genuinely appreciate for
its explicitness.

## Go Standard Library

I lean on the standard library first: `net/http` for servers, `encoding/json` for
serialisation, and `context` for cancellation propagation. I reach for third-party
libraries only when the stdlib offering is clearly insufficient.

## Go Testing

I write table-driven tests with `testing.T` and use `httptest` for handler tests. I
mock interfaces rather than concrete types so my tests remain fast and deterministic.
